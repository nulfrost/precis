# Precis - A guestbook API for your website

Precis is a dead simple API for adding a guestbook to your website. This idea came from wanting to make personal websites feel more personal. Take a look around and see if this is something you'd like to use for your own website!

## Getting started

    1. Go to https://precis.dev to create your own unique API endpoint
    2. Make a POST request to your endpoint with your API key and the username and message from the user adding to your guestbook
    3. Display the wonderful messages on your website!

## How it works

    1. POST https://api.precis.dev/v1/guestbooks/{your guestbook id}/messages
        1a. Request body should include
            - The person's username that is writing in your guestbook (string)
            - The person's message (string)
        1b. Response -> 201
    2. GET https://api.precis.dev/v1/guestbooks/{your guestbook id}/messages
        2a. Response -> An array of messages including an id, username, message, created_at, updated_at
        2b. Query Parameters
            - limit: 25, 50, 75, 100
            - created_at: asc, desc
            - page: 1, 2, 3, 4, 5, ...

## Tech Stack

**Client:** Remix, UnoCSS

**Server:** Bun, ElysiaJS, DrizzleORM, Turso

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

## Authors

- [@nulfrost](https://www.github.com/nulfrost)
