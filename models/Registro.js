const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Registro = new Schema({
    turma: {
        type: Schema.Types.ObjectId,
        ref: "turmas",
        required: true
    },
    turma_titulo:{
        type: String,
        required: true
    },
    reg:{
        type: Object,
        of: String
    },
    data:{
        type: Date,
        default: Date.now()
    },
})

mongoose.model("registro", Registro)