<h1>webAPI.js</h1>
<h2>Background</h2>
<p>
  A web API is an IO endpoint accessed through the internet, generally without any front-end. RESTful APIs communicate through hypertext transfer protocol using GET, POST, PUT, PATCH and DELETE methods.
  For more information see: https://dotnet.microsoft.com/apps/aspnet/apis
</p>
<h2>Code</h2>
<p>
  The web api itself is written in Javascript to run in the Node.js runtime environment. It uses Express.js to manage incoming HTTP requests and Mongoose.js to interface with the MongoDB database. The front end is written in HTML, Javascript and CSS with Bootstrap to simplify things.
</p>
<h2>Reflection</h2>
<p>
  Obviously it is generally better to use a premade user authentication library rather than implement ones own crypto methods since it's sp easy to get so badly wrong. As an excercise in learning how HTTP and crypto work at a basic level, I wasn't too bothered about making it perfectly secure.
TODO:
  <ul>
    <li>
        Session management to affect a login system.
    </li>
    <li>
        Secure transfer system.
    </li>
  </ul>
</p>
