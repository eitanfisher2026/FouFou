#!/usr/bin/env python3
"""
Bangkok Explorer - Build Script
Combines split source files into a single index.html for deployment.

Usage:
  python3 build.py          # Build only
  python3 build.py --open   # Build and open in browser
  python3 build.py --watch  # Build, open, and rebuild on file changes

Output: dist/index.html (single-file, ready to run)
"""

import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Source files that make up the app
JS_MODULES = ['config.js', 'utils.js']
JSX_PARTS = ['app-logic.js', 'views.js', 'dialogs.js']
SHELL = 'index.html'
ALL_FILES = [SHELL] + JS_MODULES + JSX_PARTS


def read_file(filename):
    filepath = os.path.join(SCRIPT_DIR, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()


def build():
    """Combine all source files into dist/index.html"""
    
    index_html = read_file(SHELL)
    
    # 1. Inline the plain JS modules
    old_external = '''    <!-- External JS modules (combined by build.py for single-file deployment) -->
    <script src="config.js"></script>
    <script src="utils.js"></script>'''
    
    new_inline = '    <!-- Inlined JS modules -->\n'
    for js_file in JS_MODULES:
        content = read_file(js_file)
        new_inline += f'    <script>\n{content}\n    </script>\n'
    
    index_html = index_html.replace(old_external, new_inline)
    
    # 2. Insert JSX parts
    replacements = {
        '  // __INSERT_APP_LOGIC__': read_file('app-logic.js'),
        '        {/* __INSERT_VIEWS__ */}': read_file('views.js'),
        '        {/* __INSERT_DIALOGS__ */}': read_file('dialogs.js'),
    }
    
    for marker, content in replacements.items():
        if marker not in index_html:
            print(f"  Warning: Marker not found: {marker[:40]}...")
        index_html = index_html.replace(marker, content)
    
    # 3. Make Firebase loading resilient to CSP blocks
    old_firebase = '''    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>'''
    
    new_firebase = '''    <!-- Firebase SDK - dynamic loading for CSP compatibility -->
    <script>
    (function() {
      ['firebase-app-compat.js','firebase-database-compat.js'].forEach(function(lib) {
        var s = document.createElement('script');
        s.src = 'https://www.gstatic.com/firebasejs/9.22.0/' + lib;
        s.onerror = function() { console.warn('[FIREBASE] Blocked: ' + lib); };
        document.head.appendChild(s);
      });
    })();
    </script>'''
    
    if old_firebase in index_html:
        index_html = index_html.replace(old_firebase, new_firebase)
    
    # Write output
    dist_dir = os.path.join(SCRIPT_DIR, 'dist')
    os.makedirs(dist_dir, exist_ok=True)
    output_path = os.path.join(dist_dir, 'index.html')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    line_count = index_html.count('\n') + 1
    size_kb = len(index_html.encode('utf-8')) / 1024
    print(f"  Built: dist/index.html ({line_count} lines, {size_kb:.0f} KB)")
    
    return output_path


def open_browser(filepath):
    """Open file in default browser"""
    import webbrowser
    url = 'file://' + os.path.abspath(filepath)
    webbrowser.open(url)
    print(f"  Opened in browser")


def watch_and_rebuild():
    """Watch source files and rebuild on changes"""
    print("  Watching for changes... (Ctrl+C to stop)")
    
    def get_mtimes():
        mtimes = {}
        for f in ALL_FILES:
            path = os.path.join(SCRIPT_DIR, f)
            if os.path.exists(path):
                mtimes[f] = os.path.getmtime(path)
        return mtimes
    
    last_mtimes = get_mtimes()
    
    try:
        while True:
            time.sleep(1)
            current_mtimes = get_mtimes()
            
            changed = [f for f in ALL_FILES 
                       if current_mtimes.get(f) != last_mtimes.get(f)]
            
            if changed:
                print(f"\n  Changed: {', '.join(changed)}")
                try:
                    build()
                except Exception as e:
                    print(f"  Build error: {e}")
                last_mtimes = current_mtimes
                
    except KeyboardInterrupt:
        print("\n  Stopped watching")


if __name__ == '__main__':
    args = sys.argv[1:]
    
    output = build()
    
    if '--open' in args or '--watch' in args:
        open_browser(output)
    
    if '--watch' in args:
        watch_and_rebuild()
