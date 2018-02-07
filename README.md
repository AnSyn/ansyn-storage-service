# Storage Service

This service exposes CRUD API for document storage in a backend, currently supporting elasticsearch.

## API
* GET `/api/store/:schema/:id`: Returns a document by id from a given schema.
* GET `/api/store/:schema?from&limit`: Returns a page of (max) size limit with offset from.
* POST `/api/store/:schema/:id`: Creates a new document.
* PUT `/api/store/:schema/:id`: Updated an existing document.
* DELETE `/api/store/:schema/:id`: Deletes an existing document.
* DELETE `/api/store/:schema`: Deletes an existing schema.
* DELETE `/api/store`: Flushes the store.
