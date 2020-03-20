# codeCollab

### Establish connection with tracker
**Description:**
**Event: `connecting to tracker`**

**Response Event:** `session_list`
**Data:**
``` js
session_list = [['test1','1'], 
                ['test2','2'], 
                ['test3','3']]; 
```


### Create new session
**Description:** Tracker creates a new session.
**Event: `new_session`**
**Data:**
``` js
{
"session_name": "CodeCollab.cpp",
"peer_id": "a5b7gp31a"
} 
```

**Response Event:** `session_created`
**Data:**
``` js
{
"session_name": "CodeCollab.cpp",
"session_id": "6p5s7gp"
} 
```


### Join a preexisting session/doc
**Description:** Tracker adds peer 'peer_id' to the list of peers for session 'session_id'
**Event: `join_session`**
**Data:**
``` js
{
"session_name": "CodeCollab.cpp",
"session_id": "123",
"peer_id": "a5b7gp31a"
} 
```

**Response Event:** `peer_list`
**Data:**
``` js
peer_list = ['aiwo23o','21h329','0912klk'];
```

