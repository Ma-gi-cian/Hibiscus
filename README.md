# Hibiscus

**Hibiscus** is a simple, personal markdown editor built using **Electron**, **React**, and **Vite**. It is inspired by editors like [Marktext](https://marktext.cc) and [Inkdrop](https://inkdrop.app).

>[!Caution]
> This is a learning project and is not intended for production use.

## Key Idea

The key idea for this project was inspired by *Jupiter Notebooks*, where we can write comment blocks in markdown and code in code blocks. But that is only for python.

This is intended for everything, as long as you have the compiler for that language installed in your system.

>[!Note]
> Haven't reached that point to implement this system, but will make this project public only when we are done with it.

***Example***

You could have a code block of the following manner:

```javascript
console.log("Hello world")
```

and, the line below will have

`Output: Hello, world`

This feature is intended to makr interactive technical writing much easier - tutorials, documentation, and publishing.

### Getting Started

1. Fork and Install

    ```bash
    git clone https://github.com/your-user-name/hibiscus.git
    cd hibiscus
    npm install
    ```

2. Run in Development

    ```bash
    npm run dev
    ```

    This will :
        - Launch the vite dev server.
        - Start electron in development mode.

3. Built for Production ( windows only supported right now )

```bash
npm run build
```

This will run the electron-builder, and create an executable in the dist folder that will be created simultaneously.

#### License

This project currently is licensed under the MIT license.
It is intended as a learning project and not open for contirbution, but feature requests are allowed.

Built with passion and curiosity.
