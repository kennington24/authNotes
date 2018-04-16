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
