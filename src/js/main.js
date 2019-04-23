const m = require('mithril')
const ptrn = require('./ptrn')

let input_box = ""

let part_rel = 1
let root_group = 2

ptrn.get(1).then(ob=>{
    if (ob.executed===false){
        ptrn.create("part").then(ob=>part_rel = ob.id).then(_=>{
            ptrn.create("root").then(ob=>root_group = ob.id)
        })

    }
})

let view_group

ptrn.get(root_group).then(ob=>{
    view_group = ob
    console.log(ob)
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
                    ptrn.create(input_box).then(ob=>{
                        ptrn.relate({
                            aid: root_group,
                            bid: ob.id,
                            typeid: part_rel
                        }).then(_=>{
                            ptrn.get(root_group).then(ob=>{
                                view_group = ob
                                console.log(ob)
                            })
                        })
                    })
                    input_box = ""

                }
            },"+"),

            m(".objects",[
                (view_group && view_group.answer) ? view_group.answer.relations[0].values.map(ob=>{
                    return m(".object",ob.value)
                }) : []
            ])
        ])
    }
}

m.mount(document.body, App)
