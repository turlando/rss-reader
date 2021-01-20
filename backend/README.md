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

#### POST /user

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
 
### /session

Manage personal session.

#### POST /session

Create a new session. Authentication through username and password is required.

* **Parameters**:
  * `username`: string
  * `username`: string

* **Success response**:
  * **Code**: 200
  * **Body**:
    ```
    {
        "user_id": 23,
        "token": "...",
    }
    ```

* **Error responses**:
  * ***Username or password not valid***
    * **Code**: 401

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                                             \
       -X POST                                                        \
       -H 'Content-Type: application/json'                            \
       --data '{"username": "ben_bitdiddle", "password": "changeme"}' \
       http://127.0.0.1:8000/session
  ```

#### DELETE /session

Delete an existing session. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string

* **Success response**:
  * **Code**: 200

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                  \
       -X DELETE                           \
       -H 'Content-Type: application/json' \
       -H 'X-Token: ...'                   \
       http://127.0.0.1:8000/session
  ```

### /folder

Manage personal folders.

#### POST /folder

Create a new folder. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string

* **Parameters**:
  * `name`: string
  * `parent`: number or null

* **Success response**:
  * **Code**: 200
  * **Body**:
  ```
  {
      "id": 12,
      "name": "News",
      "parentFolderId": 5
  }
  ```

* **Error responses**:
  * ***Token not valid**
    * **Code**: 401

  * ***Folder already exists***
    * **Code**: 409

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                     \
       -X POST                                \
       -H 'Content-Type: application/json'    \
       -H 'X-Token: ...'                      \
       --data '{"name": "News", "parent": 5}' \
       http://127.0.0.1:8000/folder
  ```

#### PUT /folder/{id}

Update an existing folder. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string

* **URL parameters**:
  * `id`: number

* **Parameters**:
  * `name`: string
  * `parent`: number or null

* **Success response**:
  * **Code**: 200
  * **Body**:
  ```
  {
      "id": 12,
      "name": "World News",
      "parentFolderId": 5
  }
  ```

* **Error responses**:
  * ***Token not valid**
    * **Code**: 401

  * ***Folder does not exist***
    * **Code**: 404

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                           \
       -X PUT                                       \
       -H 'Content-Type: application/json'          \
       -H 'X-Token: ...'                            \
       --data '{"name": "World News", "parent": 5}' \
       http://127.0.0.1:8000/folder/12
  ```
 
#### DELETE /folder/{id}

Remove an existing folder. Its items and its subfolders will be removed too.

Authentication through session token is required.

* **Headers**:
  * `X-Token`: string
  
* **URL parameters**:
  * `id`: number

* **Success response**:
  * **Code**: 200

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

  * ***Folder does not exist***
    * **Code**: 404

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                      \
       -X POST                                 \
       -H 'Content-Type: application/json'     \
       -H 'X-Token: ...'                       \
       --data '{"name": "News", "parent": 42}' \
       http://127.0.0.1:8000/session
  ```

### /feed

Manage personal feeds.

#### POST /feed

Create a new feed. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string

* **Parameters**:
  * `url`: string
  * `folder`: number or null

* **Success response**:
  * **Code**: 200
  * **Body**:
  ```
  {
      "id": 4,
      "url": "https://www.ansa.it/sito/ansait_rss.xml",
      "title": "RSS di   - ANSA.it",
      "link": "http://www.ansa.it/",
      "description": "Updated every day - FOR PERSONAL USE ONLY",
      "folderId": 3
  }
  ```

* **Error responses**:
  * ***Token not valid**
    * **Code**: 401

  * ***Feed already exists***
    * **Code**: 409

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                                                       \
       -X POST                                                                  \
       -H 'Content-Type: application/json'                                      \
       -H 'X-Token: ...'                                                        \
       --data '{"url": "https://www.ansa.it/sito/ansait_rss.xml", "folder": 3}' \
       http://127.0.0.1:8000/feed
  ```

#### PUT /feed/{id}

Update an existing feed. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string

* **URL parameters**:
  * `id`: number

* **Parameters**:
  * `parent`: number or null

* **Success response**:
  * **Code**: 200
  * **Body**:
  ```
  {
      "id": 4,
      "url": "https://www.ansa.it/sito/ansait_rss.xml",
      "title": "RSS di   - ANSA.it",
      "link": "http://www.ansa.it/",
      "description": "Updated every day - FOR PERSONAL USE ONLY",
      "folderId": null
  }
  ```

* **Error responses**:
  * ***Token not valid**
    * **Code**: 401

  * ***Folder does not exist***
    * **Code**: 404

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                                                          \
       -X PUT                                                                      \
       -H 'Content-Type: application/json'                                         \
       -H 'X-Token: ...'                                                           \
       --data '{"url": "https://www.ansa.it/sito/ansait_rss.xml", "folder": null}' \
       http://127.0.0.1:8000/feed/4
  ```
 
#### DELETE /feed/{id}

Remove an existing feed. Its items will be removed too.

Authentication through session token is required.

* **Headers**:
  * `X-Token`: string
  
* **URL parameters**:
  * `id`: number

* **Success response**:
  * **Code**: 200

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

  * ***Folder does not exist***
    * **Code**: 404

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                      \
       -X DELETE \
       -H 'Content-Type: application/json'     \
       -H 'X-Token: ...'                       \
       http://127.0.0.1:8000/feed/16
  ```

#### GET /feed/{id}/items

Get items for feed. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string
  
* **URL parameters**:
  * `id`: number

* **Success response**:
  * **Code**: 200
  * **Body**: TODO

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                  \
       -X GET                              \
       -H 'Content-Type: application/json' \
       -H 'X-Token: ...'                   \
       http://127.0.0.1:8000/feed/16/items
  ```

#### POST /feed/{id}/update

Retrieve feed updates. Authentication through session token is required.

* **Headers**:
  * `X-Token`: string
  
* **URL parameters**:
  * `id`: number

* **Success response**:
  * **Code**: 200

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                  \
       -X POST                             \
       -H 'Content-Type: application/json' \
       -H 'X-Token: ...'                   \
       http://127.0.0.1:8000/feed/16/update
  ```

#### GET /subscriptions

Retrieve folders and feeds tree. Authentication through session token is
required.

* **Headers**:
  * `X-Token`: string
  
* **Success response**:
  * **Code**: 200
  * **Body**:
    ```
    [
        {
            "type": "folder",
            "id": 4,
            "name": "tech",
            "parentfolderid": null,
            "children": [
                {
                    "type": "feed",
                    "id": 2,
                    "url": "http://rss.slashdot.org/slashdot/slashdotmain",
                    "title": "slashdot", "link":"https://slashdot.org/",
                    "description": "news for nerds, stuff that matters",
                    "folderid":4
                }
            ]
        }
    ]

    ```

* **Error responses**:
  * ***Token not valid***
    * **Code**: 401

   * ***Database error***
     * **Code**: 500

* **Example**:
  ```
  curl -v                                  \
       -X GET                              \
       -H 'Content-Type: application/json' \
       -H 'X-Token: ...'                   \
       http://127.0.0.1:8000/subscriptions
  ```
