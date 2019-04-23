const m = require('mithril')

function request(command, params){
    return m.request({
        method: "POST",
        url: "http://localhost:3000/",
        data: {
            query: command,
            args: params
        }
    })
}


function create(value){
    return request("declare").then(ob=>{
        return request("set_value",{
            id: ob.answer.id,
            value: value
        }).then(ob=>{
            return ob.answer
        })
    })
}

function relate(params){
    return request("relate", params).then(ob=>{
        return ob.answer
    })
}

function get(id){
    return request("get", {id})
}

module.exports = {
    create, relate, get
}
