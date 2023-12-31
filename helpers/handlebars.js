module.exports = {
  seleccionarSkills: (seleccionadas = [], opciones) => {
    const skills = [
      "HTML5",
      "CSS3",
      "CSSGrid",
      "Flexbox",
      "JavaScript",
      "TypeScript",
      "ReactJS",
      "React Hooks",
      "Redux",
      "VueJS",
      "Angular",
      "Node.js",
      "Express.js",
      "Next.js",
      "NestJS",
      "GraphQL",
      "Apollo Client",
      "RESTful APIs",
      "Webpack",
      "Babel",
      "Jest",
      "Php",
      "Cypress",
      "Java",
      "Chart.js",
      "Three.js",
      "Firebase",
      "MongoDB",
      "Mongoose",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Sequelize",
      "Django",
      "Flask",
      "FastAPI",
      "Ruby on Rails",
      "ASP.NET",
      "Spring Boot",
      "Laravel",
      "Symfony",
      "C",
      "C++",
      "Drupal",
      "WordPress",
      "Shopify",
      "Magento",
      "RxJS",
      "MobX",
      "SASS",
      "LESS",
      "Tailwind CSS",
      "Bootstrap",
      "Material-UI",
      "Ant Design",
      "Storybook",
      "JAMstack",
      "Ionic",
      "WebSockets",
      "OAuth",
      "JWT (JSON Web Tokens)",
      "CI/CD",
      "Docker",
      "Kubernetes",
      "AWS (Amazon Web Services)",
      "Azure",
      "Google Cloud Platform",
      "Netlify",
      "Vercel",
      "Heroku",
      "Serverless Framework",
      "Git",
      "GitHub",
      "GitLab",
      "Bitbucket",
      "Trello",
      "JIRA",
      "Slack",
      "Zoom",
      "VS Code",
      "Sublime Text",
      "IntelliJ IDEA",
      "WebStorm",
      "Eclipse",
      "Postman",
      "Insomnia",
      "Figma",
      "Adobe XD",
      "Sketch",
      "InVision",
      "Zeplin",
      "Agile",
      "Scrum",
      "Kanban",
      "DevOps",
      "Microservices",
      "Smart Contracts",
      "AR/VR Development",
      "Machine Learning",
      "Data Science",
      "Cybersecurity",
      "Ethical Hacking",
    ];

    let html = "";
    skills.forEach((skill) => {
      html += `
                <li ${
                  seleccionadas.includes(skill) ? ' class="activo"' : ""
                }>${skill}</li>
            `;
    });

    return (opciones.fn().html = html);
  },

  //otro
  tipoContrato: (seleccionado, opciones) => {
    return opciones
      .fn(this)
      .replace(
        new RegExp(` value="${seleccionado}"`),
        '$& selected="selected"'
      );
  },

  mostrarAlertas: (errores = {}, alertas) => {
    const categoria = Object.keys(errores);

    let html = '';
    if(categoria.length){
      errores[categoria].forEach(error => {
        html += `<div class="${categoria} alerta">
          ${error}
        </div>`;
      })
    }

    return alertas.fn().html = html;

  }

}
