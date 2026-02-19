#!/usr/bin/env python3
"""
Bangkok Explorer - Build Script
Combines split files into index.html

Usage: python3 build.py          # production build (stripped)
       python3 build.py --debug   # debug build (keeps console.log)
"""
import re, json, sys

def read_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read()

def strip_for_production(code):
    """Remove debug logging, excessive comments, and blank lines for production."""
    lines = code.split('\n')
    result = []
    
    for line in lines:
        stripped = line.strip()
        
        # Remove standalone console.log/warn lines (keep console.error)
        if re.match(r'\s*console\.(log|warn)\s*\(', stripped):
            continue
        
        # Remove addDebugLog lines  
        if re.match(r'\s*addDebugLog\s*\(', stripped):
            continue
        
        # Remove .then(() => console.log(...)) patterns
        if re.match(r'\s*\.then\(\s*\(\)\s*=>\s*console\.(log|warn)\(', stripped):
            continue
        
        # Remove .catch(err => console.log(...)) patterns  
        if re.match(r'\s*\.catch\(\s*\w+\s*=>\s*console\.(log|warn)\(', stripped):
            continue
            
        # Remove full-line comments (keep JSX comments and important markers)
        if stripped.startswith('//') and not stripped.startswith('// __INSERT') and not stripped.startswith('// ==='):
            continue
        
        # Remove empty lines (keep max 1)
        if stripped == '' and result and result[-1].strip() == '':
            continue
            
        result.append(line)
    
    return '\n'.join(result)

def build():
    debug_mode = '--debug' in sys.argv
    mode = "DEBUG" if debug_mode else "PRODUCTION"
    print(f"🔨 Building Bangkok Explorer ({mode})...")
    
    template = read_file('_source-template.html')
    i18n = read_file('i18n.js')
    config = read_file('config.js')
    
    # Load city data files
    import glob
    city_files = sorted(glob.glob('city-*.js'))
    city_data = '\n'.join([read_file(f) for f in city_files])
    if city_files:
        print(f"📦 City files: {', '.join(city_files)}")
    
    utils = read_file('utils.js')
    app_logic = read_file('app-logic.js')
    views = read_file('views.js')
    dialogs = read_file('dialogs.js')
    
    # Strip for production
    if not debug_mode:
        before = sum(len(x) for x in [app_logic, views, dialogs, utils, config])
        app_logic = strip_for_production(app_logic)
        views = strip_for_production(views)
        dialogs = strip_for_production(dialogs)
        utils = strip_for_production(utils)
        config = strip_for_production(config)
        after = sum(len(x) for x in [app_logic, views, dialogs, utils, config])
        saved = before - after
        print(f"🧹 Stripped {saved:,} bytes ({saved*100//before}% reduction)")
    
    # Extract version and write version.json
    m = re.search(r"VERSION\s*=\s*'([^']+)'", config)
    if m:
        ver = m.group(1)
        with open('version.json', 'w') as f:
            json.dump({"version": ver}, f)
        print(f"📋 Version: {ver}")
    
    output = template
    output = output.replace('// __INSERT_I18N__', i18n)
    output = output.replace('// __INSERT_CITY_DATA__', city_data)
    output = output.replace('// __INSERT_CONFIG__', config)
    output = output.replace('// __INSERT_UTILS__', utils)
    output = output.replace('// __INSERT_APP_LOGIC__', app_logic)
    output = output.replace('// __INSERT_VIEWS__', views)
    output = output.replace('// __INSERT_DIALOGS__', dialogs)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(output)
    
    lines = output.count('\n') + 1
    size_kb = len(output.encode('utf-8')) / 1024
    print(f"✅ Built index.html ({lines} lines, {size_kb:.0f}KB)")

if __name__ == '__main__':
    build()
