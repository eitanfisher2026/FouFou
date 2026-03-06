# Firebase Rules — הוספת reviews

## הוסף את הכללים הבאים ב-Firebase Console → Realtime Database → Rules

מצא את הנתיב `cities` ב-rules שלך והוסף את `reviews` בתוך `$cityId`:

```json
{
  "rules": {
    "cities": {
      "$cityId": {
        "locations": {
          // ... הכללים הקיימים שלך ...
        },
        "reviews": {
          ".read": true,
          "$placeKey": {
            ".read": true,
            "$userId": {
              ".write": "auth != null && auth.uid === $userId",
              ".validate": "newData.hasChildren(['rating', 'timestamp'])"
            }
          }
        }
      }
    }
  }
}
```

## מה זה עושה:
- **קריאה** — כולם יכולים לקרוא דירוגים (גם לא מחוברים)
- **כתיבה** — רק משתמש מחובר יכול לכתוב את הדירוג שלו (`auth.uid === $userId`)
- **ולידציה** — חייב לכלול `rating` + `timestamp`

## מבנה הנתונים:
```
cities/bangkok/reviews/
  Architecture_Chinatown__3/
    abc123uid/
      rating: 4
      text: "מקום מגניב"
      userName: "Eitan"
      timestamp: 1709542657535
    def456uid/
      rating: 5
      text: ""
      userName: "Visitor"
      timestamp: 1709542700000
```
