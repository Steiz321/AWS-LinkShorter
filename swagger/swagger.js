// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "sls-academy-2-aws-LinkShorter",
    "version": "1"
  },
  "paths": {
    "/mylinks": {
      "get": {
        "summary": "getMyLinks",
        "description": "Security: Bearer auth",
        "operationId": "getMyLinks.get.mylinks",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "Successfull API response",
            "schema": {
              "$ref": "#/definitions/myLinksResponse"
            }
          },
          "401": {
            "description": "Unauthtorized error",
            "schema": {
              "$ref": "#/definitions/Unauthorized"
            }
          }
        }
      }
    },
    "/link": {
      "post": {
        "summary": "createLink",
        "description": "Security: Bearer auth",
        "operationId": "createLink.post.link",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/createLink"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfull API response",
            "schema": {
              "$ref": "#/definitions/createLinkResponse"
            }
          },
          "401": {
            "description": "Unauthtorized error",
            "schema": {
              "$ref": "#/definitions/Unauthorized"
            }
          }
        }
      }
    },
    "/{linkParams}": {
      "get": {
        "summary": "getLink",
        "description": "",
        "operationId": "getLink.get./{linkParams}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "linkParams",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "302": {
            "description": "Successfully redirected"
          },
          "404": {
            "description": "Link not found",
            "schema": {
              "$ref": "#/definitions/serverError"
            }
          }
        }
      }
    },
    "/deactivate/{linkParams}": {
      "post": {
        "summary": "deactivateLink",
        "description": "Security: Bearer auth",
        "operationId": "deactivateLink.post.deactivate/{linkParams}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "linkParams",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successfull link deactivate",
            "schema": {
              "$ref": "#/definitions/deactivateLinkResponse"
            }
          },
          "403": {
            "description": "Forbidden",
            "schema": {
              "$ref": "#/definitions/Forbidden"
            }
          },
          "404": {
            "description": "Link not found",
            "schema": {
              "$ref": "#/definitions/serverError"
            }
          }
        }
      }
    },
    "/reactive/{linkParams}": {
      "post": {
        "summary": "reactiveLink",
        "description": "Security: Bearer auth",
        "operationId": "reactiveLink.post.reactive/{linkParams}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/reactiveLinkBody"
            }
          },
          {
            "name": "linkParams",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "Successfull link reactivate",
            "schema": {
              "$ref": "#/definitions/reactiveLinkResponse"
            }
          },
          "403": {
            "description": "Forbidden",
            "schema": {
              "$ref": "#/definitions/Forbidden"
            }
          },
          "404": {
            "description": "Link not found",
            "schema": {
              "$ref": "#/definitions/serverError"
            }
          }
        }
      }
    },
    "/sign-up": {
      "post": {
        "summary": "signUp",
        "description": "",
        "operationId": "signUp.post./sign-up",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/signUpBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfull user creation",
            "schema": {
              "$ref": "#/definitions/signUpResponse"
            }
          },
          "409": {
            "description": "Confict during sign up (user is already exists)",
            "schema": {
              "$ref": "#/definitions/Conflict"
            }
          }
        }
      }
    },
    "/sign-in": {
      "post": {
        "summary": "signIn",
        "description": "",
        "operationId": "signIn.post./sign-in",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Body required in the request",
            "required": true,
            "schema": {
              "$ref": "#/definitions/signInBody"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfull user sign in",
            "schema": {
              "$ref": "#/definitions/signInResponse"
            }
          },
          "401": {
            "description": "Unauthorized (wrong email or password)",
            "schema": {
              "$ref": "#/definitions/Unauthorized"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Unauthorized": {
      "properties": {
        "StatusCode": {
          "title": "Unauthorized.StatusCode",
          "enum": [
            401
          ],
          "type": "number"
        },
        "error": {
          "title": "Unauthorized.error",
          "type": "string"
        },
        "message": {
          "title": "Unauthorized.message",
          "type": "string"
        }
      },
      "required": [
        "StatusCode",
        "error",
        "message"
      ],
      "additionalProperties": false,
      "title": "Unauthorized",
      "type": "object"
    },
    "Forbidden": {
      "properties": {
        "StatusCode": {
          "title": "Forbidden.StatusCode",
          "enum": [
            403
          ],
          "type": "number"
        },
        "error": {
          "title": "Forbidden.error",
          "type": "string"
        },
        "message": {
          "title": "Forbidden.message",
          "type": "string"
        }
      },
      "required": [
        "StatusCode",
        "error",
        "message"
      ],
      "additionalProperties": false,
      "title": "Forbidden",
      "type": "object"
    },
    "Conflict": {
      "properties": {
        "message": {
          "title": "Conflict.message",
          "type": "string"
        },
        "errorMsg": {
          "title": "Conflict.errorMsg",
          "type": "string"
        },
        "errStack": {
          "title": "Conflict.errStack",
          "type": "string"
        }
      },
      "required": [
        "message",
        "errorMsg",
        "errStack"
      ],
      "additionalProperties": false,
      "title": "Conflict",
      "type": "object"
    },
    "serverError": {
      "properties": {
        "message": {
          "title": "serverError.message",
          "type": "string"
        },
        "errorMsg": {
          "title": "serverError.errorMsg",
          "type": "string"
        },
        "errStack": {
          "title": "serverError.errStack"
        }
      },
      "required": [
        "message",
        "errorMsg",
        "errStack"
      ],
      "additionalProperties": false,
      "title": "serverError",
      "type": "object"
    },
    "ILink": {
      "properties": {
        "linkId": {
          "title": "ILink.linkId",
          "type": "string"
        },
        "userId": {
          "title": "ILink.userId",
          "type": "string"
        },
        "originalLink": {
          "title": "ILink.originalLink",
          "type": "string"
        },
        "shortedLink": {
          "title": "ILink.shortedLink",
          "type": "string"
        },
        "oneTime": {
          "title": "ILink.oneTime",
          "type": "boolean"
        },
        "creationDate": {
          "title": "ILink.creationDate",
          "type": "string"
        },
        "expireDate": {
          "title": "ILink.expireDate",
          "type": "string"
        },
        "visits": {
          "title": "ILink.visits",
          "type": "number"
        }
      },
      "required": [
        "linkId",
        "userId",
        "originalLink",
        "shortedLink",
        "oneTime",
        "creationDate",
        "expireDate",
        "visits"
      ],
      "additionalProperties": false,
      "title": "ILink",
      "type": "object"
    },
    "myLinksResponse": {
      "properties": {
        "StatusCode": {
          "title": "myLinksResponse.StatusCode",
          "enum": [
            200
          ],
          "type": "number"
        },
        "data": {
          "items": {
            "$ref": "#/definitions/ILink",
            "title": "myLinksResponse.data.[]"
          },
          "title": "myLinksResponse.data",
          "type": "array"
        }
      },
      "required": [
        "StatusCode",
        "data"
      ],
      "additionalProperties": false,
      "title": "myLinksResponse",
      "type": "object"
    },
    "linkExpireTime": {
      "enum": [
        "one-time",
        "1d",
        "3d",
        "7d"
      ],
      "title": "linkExpireTime",
      "type": "string"
    },
    "createLink": {
      "properties": {
        "originalLink": {
          "title": "createLink.originalLink",
          "type": "string"
        },
        "expireTime": {
          "$ref": "#/definitions/linkExpireTime",
          "title": "createLink.expireTime"
        }
      },
      "required": [
        "originalLink",
        "expireTime"
      ],
      "additionalProperties": false,
      "title": "createLink",
      "type": "object"
    },
    "createLinkResponse": {
      "properties": {
        "message": {
          "title": "createLinkResponse.message",
          "enum": [
            "Successfully created a link"
          ],
          "type": "string"
        },
        "data": {
          "$ref": "#/definitions/ILink",
          "title": "createLinkResponse.data"
        }
      },
      "required": [
        "message",
        "data"
      ],
      "additionalProperties": false,
      "title": "createLinkResponse",
      "type": "object"
    },
    "deactivateLinkResponse": {
      "properties": {
        "message": {
          "title": "deactivateLinkResponse.message",
          "type": "string"
        },
        "data": {
          "properties": {
            "deactivateLink": {
              "$ref": "#/definitions/ILink",
              "title": "deactivateLinkResponse.data.deactivateLink"
            }
          },
          "required": [
            "deactivateLink"
          ],
          "additionalProperties": false,
          "title": "deactivateLinkResponse.data",
          "type": "object"
        }
      },
      "required": [
        "message",
        "data"
      ],
      "additionalProperties": false,
      "title": "deactivateLinkResponse",
      "type": "object"
    },
    "reactiveLinkBody": {
      "properties": {
        "expireTime": {
          "$ref": "#/definitions/linkExpireTime",
          "title": "reactiveLinkBody.expireTime"
        }
      },
      "required": [
        "expireTime"
      ],
      "additionalProperties": false,
      "title": "reactiveLinkBody",
      "type": "object"
    },
    "reactiveLinkResponse": {
      "properties": {
        "message": {
          "title": "reactiveLinkResponse.message",
          "type": "string"
        },
        "data": {
          "properties": {
            "reactivatedLink": {
              "$ref": "#/definitions/ILink",
              "title": "reactiveLinkResponse.data.reactivatedLink"
            }
          },
          "required": [
            "reactivatedLink"
          ],
          "additionalProperties": false,
          "title": "reactiveLinkResponse.data",
          "type": "object"
        }
      },
      "required": [
        "message",
        "data"
      ],
      "additionalProperties": false,
      "title": "reactiveLinkResponse",
      "type": "object"
    },
    "IUser": {
      "properties": {
        "userId": {
          "title": "IUser.userId",
          "type": "string"
        },
        "email": {
          "title": "IUser.email",
          "type": "string"
        },
        "password": {
          "title": "IUser.password",
          "type": "string"
        }
      },
      "required": [
        "userId",
        "email",
        "password"
      ],
      "additionalProperties": false,
      "title": "IUser",
      "type": "object"
    },
    "signUpBody": {
      "properties": {
        "email": {
          "title": "signUpBody.email",
          "type": "string"
        },
        "password": {
          "title": "signUpBody.password",
          "type": "string"
        }
      },
      "required": [
        "email",
        "password"
      ],
      "additionalProperties": false,
      "title": "signUpBody",
      "type": "object"
    },
    "signUpResponse": {
      "properties": {
        "message": {
          "title": "signUpResponse.message",
          "type": "string"
        },
        "data": {
          "properties": {
            "accessToken": {
              "title": "signUpResponse.data.accessToken",
              "type": "string"
            },
            "refreshToken": {
              "title": "signUpResponse.data.refreshToken",
              "type": "string"
            },
            "user": {
              "$ref": "#/definitions/signUpBody",
              "title": "signUpResponse.data.user"
            }
          },
          "required": [
            "accessToken",
            "refreshToken",
            "user"
          ],
          "additionalProperties": false,
          "title": "signUpResponse.data",
          "type": "object"
        }
      },
      "required": [
        "message",
        "data"
      ],
      "additionalProperties": false,
      "title": "signUpResponse",
      "type": "object"
    },
    "signInBody": {
      "properties": {
        "email": {
          "title": "signInBody.email",
          "type": "string"
        },
        "password": {
          "title": "signInBody.password",
          "type": "string"
        }
      },
      "required": [
        "email",
        "password"
      ],
      "additionalProperties": false,
      "title": "signInBody",
      "type": "object"
    },
    "signInResponse": {
      "properties": {
        "message": {
          "title": "signInResponse.message",
          "type": "string"
        },
        "data": {
          "properties": {
            "accessToken": {
              "title": "signInResponse.data.accessToken",
              "type": "string"
            },
            "refreshToken": {
              "title": "signInResponse.data.refreshToken",
              "type": "string"
            },
            "user": {
              "$ref": "#/definitions/signUpBody",
              "title": "signInResponse.data.user"
            }
          },
          "required": [
            "accessToken",
            "refreshToken",
            "user"
          ],
          "additionalProperties": false,
          "title": "signInResponse.data",
          "type": "object"
        }
      },
      "required": [
        "message",
        "data"
      ],
      "additionalProperties": false,
      "title": "signInResponse",
      "type": "object"
    }
  },
  "securityDefinitions": {}
};