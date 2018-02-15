# Storage Service

This service exposes CRUD API for document storage in a backend, currently supporting elasticsearch.

## API
* GET `/api/store/:schema/:id`: Returns a document by id from a given schema.
* GET `/api/store/:schema?from&limit`: Returns a page of (max) size limit with offset from.
* POST `/api/store/:schema`: Creates a new schema.
* POST `/api/store/:schema/:id`: Creates a new document.
* PUT `/api/store/:schema/:id`: Updates an existing document.
* DELETE `/api/store/:schema/:id`: Deletes an existing document.
* DELETE `/api/store/:schema`: Deletes an existing schema.
* DELETE `/api/store`: Flushes the store.

# Getting Started

Running the service locally requires a running elasticsearch instance. In addition, for Ansyn to work correctly, 3 schemas should be created: layers, cases and contexts, using the following commands: 
- `curl -XPOST http://localhost:8080/api/store/layers`
- `curl -XPOST http://localhost:8080/api/store/cases`
- `curl -XPOST http://localhost:8080/api/store/contexts`
