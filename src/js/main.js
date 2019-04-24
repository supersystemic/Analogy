const m = require('mithril')
const ptrn = require('./ptrn')

let input_box = ""
let view_set

//build a library of utility values from bootstrapping point
let p = {
    bootstrap: 0,
    part: 1,
}

ptrn.get(p.bootstrap).then(ob=>{
    ob.relations[p.part].values.forEach(r=>{
        p[r.value] = r.id
    })
    console.log(p)
}).then(_=>{

    //load up the document if it doesn't exist
    if(p.document === undefined) {
        ptrn.create("document").then(ob=>{
            p.document = ob.id
            ptrn.relate(p.part, p.bootstrap, p.document)
            view_set = ob
        })
    } else {
        //load up the document if it doesn't exist
        ptrn.get(p.document).then(ob=>{
            view_set = ob
            console.log(view_set)
        })
    }
})



const App = {
    view: function() {
        return m("main", [
            m("input", {
                value: input_box,
                oninput: e => input_box = e.target.value
            }),
            m("button",{
                onclick: e => {
                    ptrn.create(input_box)
                        .then(ob=> ptrn.relate(p.part, view_set.id, ob.id))
                        .then(ob=> ptrn.get(view_set.id))
                        .then(ob=> view_set = ob)
                    input_box = ""
                }
            },"+"),

            m(".objects",[
                (view_set && view_set.relations[p.part]) ? view_set.relations[p.part].values.map(ob=>{
                    return m(".object",ob.value)
                }) : []
            ])
        ])
    }
}

m.mount(document.body, App)
