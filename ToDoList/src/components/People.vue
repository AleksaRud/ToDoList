<script setup lang="ts">
import { ref } from 'vue';
//import type { Person} from './types'

function getStorageData(key:string, defaultValue:Array<Object>) {
    if(window.localStorage.getItem(key)){
        return JSON.parse(window.localStorage.getItem(key)!);
    } else{
        return defaultValue;
    }
}
function setStorageData(key:string, data:Array<Object>) {
window.localStorage.setItem(key, JSON.stringify(data));
}

const people = ref([
    {id: '0', name: 'Nik', email:'', },
    {id: '1', name: 'Mike', email:'',},
    {id: '2', name: 'Ann', email:'',},
]);

people.value = getStorageData('people', people.value);
setStorageData('people', people.value);

const new_person = ref({name: '', email:'',});
const add_person_flag = ref(false);
function addPerson(name:string, email:string){
    if(new_person.value.name && new_person.value.email){
        people.value.push({id: people.value.length.toString(), name: name, email: email,})
        add_person_flag.value = !add_person_flag.value;
        setStorageData('people', people.value);
    }
    else{
        alert('Заполните поля!');
    }
}
function cancel(){
    new_person.value.name = '';
    new_person.value.email = '';
    add_person_flag.value = !add_person_flag.value;
}
function deletePerson(id:string){
    let pos = people.value.findIndex(person => person.id == id);
    people.value.splice(pos, 1);
    for(let i=0; i<people.value.length; i++){
        people.value[i].id = i.toString();
    }
    setStorageData('people', people.value);
}


</script>

<template>
    <div class="people">
        <div v-if="!add_person_flag">
            <button @click="add_person_flag = !add_person_flag">Add</button>
        </div>
        <div v-if="add_person_flag" class="add-window">
            Name
            <input type="text" v-model="new_person.name" />
            E-mail
            <input type="email" v-model="new_person.email"/>
            <button @click="cancel()">cancel</button>
            <button @click="addPerson(new_person.name, new_person.email)"> add</button>
        </div>
        <div class="table">
            
                <div v-for="person in people" class="person">
                    <div class="name">{{ person.name }}</div>
                    <div class="email">{{ person.email }}</div>
                    <button @click="deletePerson(person.id)">delete</button>
                </div>
            
        </div>
    </div>
</template>

<style scoped>
.people{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 80px;
    margin-top: 100px;
}
.table{
    display: flex;
    flex-direction: column;
    width: fit-content;
}
.person{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    box-sizing: border-box;
    gap: 40px;
    width: fit-content;
    padding: 10px 10px;
    border-bottom: 1px solid black;
}
.add-window{
    display: flex;
    width: 200px;
    flex-direction: column;
    
    border: 1px solid black;
    padding: 20px;
}
.name{
    width: 200px;
}
.email{
    width: 300px;
   
}
</style>
