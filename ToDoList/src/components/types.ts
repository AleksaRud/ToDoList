type Item = {
    id:string, 
    title:String, 
    discription:String,
    added_people: Array<String>, 
    label_color:String, 
    list:number, 
    in_edit:boolean
};

type Person = {
    id:string, 
    name:String,
    email:String, 
};

export type {Item }
export type {Person}