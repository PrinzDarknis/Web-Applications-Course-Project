define({ "api": [
  {
    "type": "post",
    "url": "/api/users/authenticate",
    "title": "Get JWT",
    "name": "AuthenticateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..",
            "optional": false,
            "field": "username",
            "description": "<p>User who want to login.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"username\": \"john\",\n   \"password\": \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The JWt to use for authentification.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>The User Object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.id",
            "description": "<p>ID of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.name",
            "description": "<p>Name of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.username",
            "description": "<p>Username of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.email",
            "description": "<p>E-Mail adress of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "\"everyone\"",
              "\"registered\"",
              "\"friends\"",
              "\"private\""
            ],
            "optional": false,
            "field": "result.privacy",
            "description": "<p>Privacy configuration of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friends",
            "description": "<p>List of IDs of Friends.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friendsAsked",
            "description": "<p>List of IDs of people who want to be Friends.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"token\": \"JWT AHHI456468463...\",\n  \"result\": {\n     \"id\": \"10A46\",\n     \"name\": \"John Doe\",\n     \"username\": \"John_Doe\",\n     \"email\": \"John@Doe.de\",\n     \"privacy\": \"everyone\",\n     \"friends\": [ \"Max\" ],\n     \"friendsAsked\": [ \"Maria\", \"Yui\" ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WrongCredentials",
            "description": "<p>Username or Password is wrong</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideParams",
            "description": "<p>same of the given params are invalide</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Something happened on the Server Side</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "WrongCredentials:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"msg\": \"Wrong Username or Password\"\n}",
          "type": "json"
        },
        {
          "title": "InvalideParams:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"Invalide input\",\n  \"error\": [\n     {\n       \"value\": \"invalide Value\",\n       \"msg\": \"what is wrong\",\n       \"param\": \"parameter Name\",\n       \"location\": \"parameter location\"\n     }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"success\": false,\n  \"msg\": \"Error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/users/:id",
    "title": "Request User Information",
    "name": "GetUser",
    "group": "User",
    "header": {
      "fields": {
        "Optional Headers": [
          {
            "group": "Optional Headers",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization via JWT.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"JWT Ahjdkjsdjiw...\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Users unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": {\n     \"id\": \"10A46\",\n     \"name\": \"John Doe\",\n     \"username\": \"John_Doe\"\n  }\n}",
          "type": "json"
        },
        {
          "title": "Success-Response Friend:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": {\n     \"id\": \"10A46\",\n     \"name\": \"John Doe\",\n     \"username\": \"John_Doe\",\n     \"email\": \"John@Doe.de\",\n     \"privacy\": \"everyone\",\n     \"friends\": [ \"Max\" ],\n     \"friendsAsked\": [ \"Maria\", \"Yui\" ]\n  }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>The User Object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.id",
            "description": "<p>ID of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.name",
            "description": "<p>Name of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.username",
            "description": "<p>Username of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.email",
            "description": "<p>E-Mail adress of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "\"everyone\"",
              "\"registered\"",
              "\"friends\"",
              "\"private\""
            ],
            "optional": false,
            "field": "result.privacy",
            "description": "<p>Privacy configuration of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friends",
            "description": "<p>List of IDs of Friends.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friendsAsked",
            "description": "<p>List of IDs of people who want to be Friends.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Something happened on the Server Side</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UserNotFound:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"msg\": \"Cannot find User\"\n}",
          "type": "json"
        },
        {
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"success\": false,\n  \"msg\": \"Error message\"\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/api/users/register",
    "title": "Register New User",
    "name": "RegisterUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..",
            "optional": false,
            "field": "username",
            "description": "<p>User who want to login.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..",
            "optional": false,
            "field": "password",
            "description": "<p>Password of the User.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"username\": \"john\",\n   \"password\": \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"msg\": \"User registered\"\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>The User Object.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.id",
            "description": "<p>ID of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.name",
            "description": "<p>Name of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.username",
            "description": "<p>Username of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.email",
            "description": "<p>E-Mail adress of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "\"everyone\"",
              "\"registered\"",
              "\"friends\"",
              "\"private\""
            ],
            "optional": false,
            "field": "result.privacy",
            "description": "<p>Privacy configuration of the User.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friends",
            "description": "<p>List of IDs of Friends.</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "result.friendsAsked",
            "description": "<p>List of IDs of people who want to be Friends.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UsernameTaken",
            "description": "<p>The Username is already taken.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideParams",
            "description": "<p>same of the given params are invalide</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Something happened on the Server Side</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "UsernameTaken:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"success\": false,\n  \"msg\": \"Username is taken\"\n}",
          "type": "json"
        },
        {
          "title": "InvalideParams:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"Invalide input\",\n  \"error\": [\n     {\n       \"value\": \"invalide Value\",\n       \"msg\": \"what is wrong\",\n       \"param\": \"parameter Name\",\n       \"location\": \"parameter location\"\n     }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"success\": false,\n  \"msg\": \"Error message\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/users.js",
    "groupTitle": "User"
  }
] });
