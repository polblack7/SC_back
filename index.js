const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const swaggerUi = require('swagger-ui-express')
const swaggerjsdoc = require('swagger-jsdoc')
const bodyParser = require('body-parser');
const taskRoutes = require('./routesTasks/taskRoutes');
const PORT = process.env.PORT || 5004
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json())
app.use("/auth", authRouter)
app.use('/tasks', taskRoutes);




// Настройка CORS
const corsOptions = {
  origin: 'http://localhost:5004',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "A simple authentication API"
        },
        servers: [
            {
                url: "http://localhost:5004"
            }
        ]
    },
    apis: ["./authRouter.js"]
}

const specs = swaggerjsdoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

const start = async () => {
    try {
        const password = encodeURIComponent("n@n-7RFrjVWp9BD");
        await mongoose.connect(`mongodb+srv://polblack89:${password}@cluster0.fdjv312.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
