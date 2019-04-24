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

function relate(typeid, aid, bid){
    return request("relate", {
        typeid, aid, bid
    }).then(ob=>{
        if(ob.executed === false){
            throw ob.error
        }
        return ob.answer
    })
}

function reorder(typeid, aid, oldpos, newpos){
    return request("reorder", {
        typeid, aid, oldpos, newpos
    }).then(ob=>{
        if(ob.executed === false){
            throw ob.error
        }
        return ob.answer
    })
}

function get(id){
    return request("get", {id}).then(ob=>{
        if(ob.executed === false){
            throw ob.error
        }
        return ob.answer
    })
}

module.exports = {
    create, relate, reorder, get
}
