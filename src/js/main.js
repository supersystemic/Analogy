const m = require('mithril')
const ptrn = require('./ptrn')

let input_box = ""
let view_set

function mapRelation(ob, rel, callback){
    if (typeof ob === 'undefined') return []
    if(typeof ob.relations === 'undefined') return []
    if(typeof ob.relations[rel] === 'undefined') return []
    return ob.relations[rel].values.map(callback)
}

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

const Obj = {
    view: function(vnode) {
        let ob = vnode.attrs.ob
        let pos = vnode.attrs.pos

        return m(".object",{
            draggable: true,
            ondragstart: ev=>{
                ev.dataTransfer.setData("pos", pos)
            },
            ondrop: ev=>{
                ev.preventDefault();
                let opos = ev.dataTransfer.getData("pos")
                ptrn.reorder(p.part, view_set.id, opos, pos)
                    .then(o=> ptrn.get(view_set.id))
                    .then(o=> view_set = o)
            },
            ondragover: ev=> {
                ev.preventDefault()
            }
        },[
            m(".object_value",ob.value),
            m(".object_children", [
                mapRelation(ob,p.part, (other, pos)=>{
                    return m(Obj,{ob: other, pos})
                }),
                m("button",{
                    onclick: e => {
                        ptrn.create(input_box)
                            .then(o=> ptrn.relate(p.part, ob.id, o.id))
                            .then(o=> ptrn.get(view_set.id))
                            .then(o=> view_set = o)
                        input_box = ""
                    }
                },"+"),
            ]),

        ])
    }
}

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
                        .then(o=> ptrn.relate(p.part, view_set.id, o.id))
                        .then(o=> ptrn.get(view_set.id))
                        .then(o=> view_set = o)
                    input_box = ""
                }
            },"+"),

            m(".objects",[
                (view_set && view_set.relations && view_set.relations[p.part]) ? view_set.relations[p.part].values.map((ob,pos)=>{
                    return m(Obj,{ob,pos})
                }) : []
            ])
        ])
    }
}

m.mount(document.body, App)
