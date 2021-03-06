define({ "api": [
  {
    "type": "get",
    "url": "/api/posts/:id",
    "title": "Get one Post",
    "name": "GetPost",
    "group": "Post",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Posts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "onlyComments",
            "description": "<p>Return only the Comments of the Post. (optional) <br/> Use: if Post already known because of getPosts</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Array of Posts.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result.comments",
            "description": "<p>Array of Comments.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.id",
            "description": "<p><code>id</code> of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author",
            "description": "<p>Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author._id",
            "description": "<p>ID of Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author.username",
            "description": "<p>Username of Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.text",
            "description": "<p>Comment Text.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.comments.date",
            "description": "<p>Creation Date of the Comment.</p>"
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
            "type": "String",
            "optional": false,
            "field": "result._id",
            "description": "<p>ID of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.title",
            "description": "<p>Title of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.text",
            "description": "<p>Text of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result.author",
            "description": "<p>Author of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author._id",
            "description": "<p><code>if</code> of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author.username",
            "description": "<p>Username of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.postDate",
            "description": "<p>Creation Date of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result.image",
            "description": "<p>Has the Post an Image?</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": {\n     \"_id\": \"10A46...\",\n     \"title\": \"Post Title\",\n     \"text\": \"some text.\",\n     \"author\": {\n       \"_id\": \"5fda15344d46c345a00306ce\",\n       \"username\": \"john\"\n     },\n     \"postDate\": \"15.12.2020 15:25:56\",\n     \"image\": \"true\",\n     \"comments\": [\n       {\n         \"_id\": \"HGTZJN5663\",\n         \"author\": {\n           \"_id\": \"5fda15344d46c345a00306ce\",\n           \"username\": \"john\"\n         },\n         \"text\": \"nice Post\",\n         \"date\": \"15.12.2020 15:35:56\"\n       }\n     ]\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/posts.js",
    "groupTitle": "Post",
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
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Following the Posts privacy you are not allowed to fetch the Data.</p>"
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
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"msg\": \"Following the Posts privacy you are not allowed to fetch the Data\"\n}",
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
    }
  },
  {
    "type": "get",
    "url": "/api/posts/:id/image",
    "title": "Get Image from Post",
    "name": "GetPostImage",
    "group": "Post",
    "header": {
      "fields": {
        "Optional Headers": [
          {
            "group": "Optional Headers",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization via JWT. <br/> Also possible as Cookie. The Cookie needs to be <code>jwt</code> and needs to be in the format: <br/> <code>JWT Ahjdkjsdjiw...</code></p>"
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
            "description": "<p>Posts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"normal\"",
              "\"small\""
            ],
            "optional": false,
            "field": "Size",
            "description": "<p>of the Image.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nContent-Type: 'image/png'\nContent-Length: '1400'",
          "type": "binary"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/posts.js",
    "groupTitle": "Post",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Following the Posts privacy you are not allowed to fetch the Data.</p>"
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
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"msg\": \"Following the Posts privacy you are not allowed to fetch the Data\"\n}",
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
    }
  },
  {
    "type": "get",
    "url": "/api/posts",
    "title": "Get List of Posts",
    "name": "GetPosts",
    "group": "Post",
    "description": "<p>Gives Post without Comments to save Traffic</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "newer",
            "description": "<p>Show only Post newer than these Date. (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "older",
            "description": "<p>Show only Post older than these Date. (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "max",
            "defaultValue": "20",
            "description": "<p>Maximal number of Post deliverd (starting from newest). (optional)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Show only Post from the User with these <code>id</code>. (optional)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Array of Posts.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "firstDate",
            "description": "<p>Date of the first Post (for loading more later).</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastDate",
            "description": "<p>Date of the last Post (for loading more later).</p>"
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
            "type": "String",
            "optional": false,
            "field": "result._id",
            "description": "<p>ID of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.title",
            "description": "<p>Title of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.text",
            "description": "<p>Text of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result.author",
            "description": "<p>Author of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author._id",
            "description": "<p><code>if</code> of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author.username",
            "description": "<p>Username of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.postDate",
            "description": "<p>Creation Date of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result.image",
            "description": "<p>Has the Post an Image?</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": [\n     {\n       \"_id\": \"10A46\",\n       \"title\": \"Post Title\",\n       \"text\": \"some text.\",\n       \"author\": {\n         \"_id\": \"5fda15344d46c345a00306ce\",\n         \"username\": \"john\"\n       },\n       \"postDate\": \"15.12.2020 15:25:56\",\n       \"image\": \"true\"\n     }\n  ],\n  \"firstDate\": \"15.12.2020 15:25:56\",\n  \"lastDate\": \"15.12.2020 15:25:56\",\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/posts.js",
    "groupTitle": "Post",
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
    "error": {
      "fields": {
        "Error 4xx": [
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
    }
  },
  {
    "type": "post",
    "url": "/api/posts/:id/comment",
    "title": "Write a Comment",
    "name": "WriteComment",
    "group": "Post",
    "permission": [
      {
        "name": "registered",
        "title": "Olny registered Users",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Posts unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "text",
            "description": "<p>Comment text.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result",
            "description": "<p>The Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.id",
            "description": "<p><code>id</code> of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author",
            "description": "<p>ID of the Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.text",
            "description": "<p>Comment Text.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.date",
            "description": "<p>Creation Date of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": [\n     {\n       \"_id\": \"2HHIKKL\",\n       \"author\": \"20A47\",\n       \"text\": \"nice Post\",\n       \"date\": \"15.12.2020 15:35:56\"\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/posts.js",
    "groupTitle": "Post",
    "header": {
      "fields": {
        "Headers": [
          {
            "group": "Headers",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization via JWT.</p>"
          },
          {
            "group": "Headers",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>must be <code>'application/json'</code></p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Content-Type\" : \"application/json\"\n  \"Authorization\": \"JWT Ahjdkjsdjiw...\"\n}",
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
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>needs valide JWT</p>"
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
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"msg\": \"Following the Posts privacy you are not allowed to fetch the Data\"\n}",
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
    "url": "/api/posts/",
    "title": "Write a Post",
    "name": "WritePost",
    "group": "Post",
    "permission": [
      {
        "name": "registered",
        "title": "Olny registered Users",
        "description": ""
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "size": "1..",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the Post.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..",
            "optional": false,
            "field": "text",
            "description": "<p>Post Text.</p>"
          },
          {
            "group": "Parameter",
            "type": "Image",
            "optional": false,
            "field": "image",
            "description": "<p>An Image File to be in the Post.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result",
            "description": "<p>Created Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "result.comments",
            "description": "<p>Array of Comments.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.id",
            "description": "<p><code>id</code> of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author",
            "description": "<p>Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author._id",
            "description": "<p>ID of Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.author.username",
            "description": "<p>Username of Author of the Comment.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.comments.text",
            "description": "<p>Comment Text.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.comments.date",
            "description": "<p>Creation Date of the Comment.</p>"
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
            "type": "String",
            "optional": false,
            "field": "result._id",
            "description": "<p>ID of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.title",
            "description": "<p>Title of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.text",
            "description": "<p>Text of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "result.author",
            "description": "<p>Author of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author._id",
            "description": "<p><code>if</code> of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "result.author.username",
            "description": "<p>Username of the Author.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "result.postDate",
            "description": "<p>Creation Date of the Post.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "result.image",
            "description": "<p>Has the Post an Image?</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": {\n     \"_id\": \"10A46...\",\n     \"title\": \"Post Title\",\n     \"text\": \"some text.\",\n     \"author\": {\n       \"_id\": \"5fda15344d46c345a00306ce\",\n       \"username\": \"john\"\n     },\n     \"postDate\": \"15.12.2020 15:25:56\",\n     \"image\": \"true\",\n     \"comments\": [\n       {\n         \"_id\": \"HGTZJN5663\",\n         \"author\": {\n           \"_id\": \"5fda15344d46c345a00306ce\",\n           \"username\": \"john\"\n         },\n         \"text\": \"nice Post\",\n         \"date\": \"15.12.2020 15:35:56\"\n       }\n     ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./routes/posts.js",
    "groupTitle": "Post",
    "header": {
      "fields": {
        "Headers": [
          {
            "group": "Headers",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization via JWT.</p>"
          },
          {
            "group": "Headers",
            "type": "String",
            "optional": false,
            "field": "Content-Type",
            "description": "<p>must be <code>'multipart/form-data'</code> with boundary</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Content-Type\" : \"multipart/form-data\"\n  \"Authorization\": \"JWT Ahjdkjsdjiw...\"\n}",
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
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>needs valide JWT</p>"
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
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"msg\": \"Following the Posts privacy you are not allowed to fetch the Data\"\n}",
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
    "type": "post",
    "url": "/api/users/:id/askFriend",
    "title": "Ask for Friendship",
    "name": "BefriendUser",
    "group": "User",
    "header": {
      "fields": {
        "Headers": [
          {
            "group": "Headers",
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
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "allowedValues": [
              "\"friend\"",
              "\"asked\""
            ],
            "optional": false,
            "field": "state",
            "description": "<p>State of the request.</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"state\": \"asked\"\n}",
          "type": "json"
        }
      ]
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
            "field": "Unauthorized",
            "description": "<p>needs valide JWT</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalideID",
            "description": "<p>The given <code>id</code> is invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>The <code>id</code> of the User was not found.</p>"
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
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "InvalideID:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"invalid recource ID\",\n  \"id\": \"TheIvalideID\"\n}",
          "type": "json"
        },
        {
          "title": "UserNotFound:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"success\": false,\n  \"msg\": \"Cannot find User\"\n}",
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
    "url": "/api/users/:id",
    "title": "Change User Data",
    "name": "ChangeUser",
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
            "description": "<p>new Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "size": "3..",
            "optional": false,
            "field": "password",
            "description": "<p>new Password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "\"everyone\"",
              "\"registered\"",
              "\"friends\"",
              "\"private\""
            ],
            "optional": false,
            "field": "privacy",
            "description": "<p>new Privacy configuration.</p>"
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
            "field": "InvalideParams",
            "description": "<p>same of the given params are invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>needs valide JWT</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UsernameTaken",
            "description": "<p>The Username is already taken.</p>"
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
          "title": "InvalideParams:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"Invalide input\",\n  \"error\": [\n     {\n       \"value\": \"invalide Value\",\n       \"msg\": \"what is wrong\",\n       \"param\": \"parameter Name\",\n       \"location\": \"parameter location\"\n     }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "Unauthorized:",
          "content": "HTTP/1.1 401 Unauthorized",
          "type": "json"
        },
        {
          "title": "UsernameTaken:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"success\": false,\n  \"msg\": \"Username is taken\"\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"result\": {\n     \"id\": \"10A46\",\n     \"name\": \"John Doe\",\n     \"username\": \"John_Doe\",\n     \"friendsAsked\": [ \"Maria\", \"Yui\" ]\n  }\n}",
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
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p><code>&quot;User registered&quot;</code></p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Was request successful?.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"msg\": \"User registered\"\n}",
          "type": "json"
        }
      ]
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
            "field": "InvalideParams",
            "description": "<p>same of the given params are invalide</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UsernameTaken",
            "description": "<p>The Username is already taken.</p>"
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
          "title": "InvalideParams:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"success\": false,\n  \"msg\": \"Invalide input\",\n  \"error\": [\n     {\n       \"value\": \"invalide Value\",\n       \"msg\": \"what is wrong\",\n       \"param\": \"parameter Name\",\n       \"location\": \"parameter location\"\n     }\n  ]\n}",
          "type": "json"
        },
        {
          "title": "UsernameTaken:",
          "content": "HTTP/1.1 409 Conflict\n{\n  \"success\": false,\n  \"msg\": \"Username is taken\"\n}",
          "type": "json"
        },
        {
          "title": "ServerError:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"success\": false,\n  \"msg\": \"Error message\"\n}",
          "type": "json"
        }
      ]
    }
  }
] });
