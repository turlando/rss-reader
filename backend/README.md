# rss-reader-backend


## Run
```
mkdir pgdata
docker-compose-up -d
npm run start
```


## Endpoints

### /user

Request new user accounts.

#### POST

Create a new user. No authentication is required.

* **Parameters**:
  * `username`: string
  * `username`: string

* **Success response**:
  * **Code**: 200
  * **Body**:
    ```
    {
        "id": 23,
        "username": "ben_bitdiddle"
    }
    ```

* **Error responses**:
  * ***Username already taken***
    * **Code**: 409

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                                             \
       -X POST                                                        \
       -H 'Content-Type: application/json'                            \
       --data '{"username": "ben_bitdiddle", "password": "changeme"}' \
       http://127.0.0.1:8000/user
  ```
 
### Create new session

```
curl -v                                                \
     -X POST                                           \
     -H 'Content-Type: application/json'               \
     --data '{"username": "test", "password": "test"}' \
     http://127.0.0.1:8000/session
```

### Create new folder

```
curl -v                                  \
     -X POST                             \
     -H 'Content-Type: application/json' \
     -H 'X-Token: ...'                   \
     --data '{"name": "1", "parent": 4}' \
     http://127.0.0.1:8000/folder
```

### Recursively remove folder

```
curl -v                                  \
     -X DELETE                           \
     -H 'Content-Type: application/json' \
     -H 'X-Token: ...'                   \
     http://127.0.0.1:8000/folder/2
```

### Update folder

```
curl -v                                  \
     -X PUT                              \
     -H 'Content-Type: application/json' \
     -H 'X-Token: ...'                   \
     --data '{"name": "2", "parent": 4}' \
     http://127.0.0.1:8000/folder/5
```
