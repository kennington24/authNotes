# Adding Authentication to APIs

## Topics

* express middleware review (global vs local).
* mongoose middleware review (lifecycle hooks).
* extending mongoose models with custom `methods` and `statics`.
* hashing user passwords for database storage.

* persisting state across requests using sessions (in-memory and persisted in mongo).
* authenticating users using cookies/sessions.
* protecting resources from unauthenticated users.

* authenticating users using JSON Web Tokens (JWTs, pronounced JOT).
* persisting tokens on the front-end to keep users authenticated across sessions.

* security good practices.

Proper AuthN

* password storage
* brute-force attack mitigation
* password strength

Hashing vs Encryption

Encryption is a two-way process.

* plain text password + private key => ecrypted password.
* private key + ecrypted password => plain text password.

Hashing is a one way process. There is no way to get the original pass from the hash.

* parameters + password => hash.
* it is like pure function. Given the same input, always returns the same output.
* MD5, SHA1-n, they alone are no good, because they are optimized for speed.
* we need a way to slow down the production of hashes => cost or rounds.
* adding rounds the attacker needs to know inputs, hashing function and #rounds.

[hash] + [time] = [Key Derivation Function] = bcrypt.

[The Seif](https://channel9.msdn.com/Blogs/Technology-and-Friends/tf446)
[The haystack](https://www.grc.com/haystack.htm)

## Review

* express middleware
  * global
  * local (route specific)
  * error
* mongoose middleware
  * lifecycle hooks
  * pre and post
* mongoose methods and statics
* hashing
  * one way
  * rounds? slow down the # hashes we generate over time

client <-request/response-> api <-query/results-> mongo

## Sessions

* sessions are a way to persist data across requests.
* each user/device has a unique session.

### Adding session support:

```js
const session = require('express-session');
server.use(
  session({
    secret: 'nobody tosses a dwarf!',
    cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds
    httpOnly: true,
    secure: true,
  })
);
```

Now we can store session data in one route handler and read it in another.

```js
app.get('/', (req, res) => {
  req.session.name = 'Luis';
  res.send('got it');
});
app.get('/greet', (req, res) => {
  const name = req.session.name;
  res.send(`hello ${req.session.name}`);
});
```

### Common ways to store session data:

* memory
* cookie
* memory cache (like Redis and Memcached)
* database

### Storing session data in memory

* data stored in memory is wiped when the server restarts.
* causes memory leaks as more and more memory is used as the application continues to store data in session for different clients.
* good for development due to its simplicity.

### Storing session data in cookies.

* a cookie is a small key/value pair data structure that is passed back and forth between client and server and stored in the browser.
* the server use it to store information about a particular client/user.
* workflow for using cookies as session storage:
  * the server issues a cookie with an expiration time and sends it with the response.
  * browsers automatically store the cookie and send it on every request to the same domain.
  * the server can read the information contained in the cookie (like the username).
  * the server can make changes to the cookie before sending it back on the response.
  * rinse and repeat.

**express-session uses cookies for session management**.

Drawbacks when using cookies

* small size, around 4KB.
* sent in every request, increasing the size of the request if too much information is stored in them.
* if an attacker gets a hold of the private key used to encrypt the cookie they could read the cookie data.

### Storing session data in Memory Cache (preferred way of storing sessions in production applications)

* stored as key-value pair data in a separate server.
* the server still uses a cookie, but it only contains the session id.
* the memory cache server uses that session id to find the session data.

Advantages

* quick lookups.
* decoupled from the api server.
* a single memory cache server can serve may applications.
* automatically remove old session data.

Downsides

* another server to set up and manage.
* extra complexity for small applications.
* hard to reset the cache without losing all session data.

### Storing session data in a database

* similar to storing data in a memory store.
* the session cookie still holds the session id.
* the server uses the session id to find the session data in the database.
* retrieving data from a database is slower than reading from a memory cache.
* causes chatter between the server an the database.
* **need to manage/remove old sessions manually** or the database will be filled with unused session data. **connect-mongo manages that for you**.
