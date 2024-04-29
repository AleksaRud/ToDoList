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
    {id: '0', name: 'Nik', email:'example1@example.com', },
    {id: '1', name: 'Mike', email:'example2@example.com',},
    {id: '2', name: 'Ann', email:'example3@example.com',},
]);

people.value = getStorageData('people', people.value);
setStorageData('people', people.value);

const new_person = ref({name: '', email:'',});
const add_person_flag = ref(false);
function addPerson(name:string, email:string){
    if(new_person.value.name && new_person.value.email){
        people.value.push({id: people.value.length.toString(), name: name, email: email,})
        setStorageData('people', people.value);
        add_person_flag.value = !add_person_flag.value;
        new_person.value.name = '';
        new_person.value.email = '';
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

const theme = {
    token: {
        "colorPrimary": "#87bba2",
        "borderRadius": 5,
        "lineWidth": 2,

        "colorInfo": "#87bba2",
    }
}
</script>

<template>
    <div class="people">
        <div v-if="!add_person_flag">
            <button @click="add_person_flag = !add_person_flag" class="add-user">
                <div class="user-add-icon"></div>
                Добавить пользователя
            </button>
        </div>
        <a-config-provider :theme="theme">
            <div v-if="add_person_flag" class="add-window">
                Имя
                <a-textarea
                    v-model:value="new_person.name"
                    placeholder="Введите Имя"
                    auto-size
                    />
                Эл. почта
                <a-textarea
                    v-model:value="new_person.email"
                    placeholder="Email"
                    auto-size
                />
                <div class="buttons">
                    <button @click="cancel()">Отмена</button>
                    <button @click="addPerson(new_person.name, new_person.email)">Добавить</button>
                </div>
            </div>
        </a-config-provider>
        <div class="table">
            
                <div v-for="person in people" class="person">
                    <div class="name">{{ person.name }}</div>
                    <div class="email">{{ person.email }}</div>
                    <button @click="deletePerson(person.id)" class="user-remove"></button>
                </div>
            
        </div>
    </div>
</template>

<style scoped>
*{
    font-size: 17px;
    color: #232523;
    font-weight: 500;
    transition: all 0.3s;
}
button{
    border: none;
    transition: all 0.3s;
    background-color: #87BBA2;
    color: #FFFFFF;
    padding: 8px 10px;
    border-radius: 8px;
}
button:hover{
    background-color: #5d737e;
}
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
    border-bottom: 2px solid #5d737e;
}
.add-window{
    display: flex;
    width: 200px;
    flex-direction: column;
    gap: 6px;
    border: 2px solid #87BBA2;
    background-color: #f0f7ee;
    outline: 6px solid #87BBA2;
    outline-offset: -2px;
    border-radius: 6px;
    padding: 20px;
}
.buttons{
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;
}
.name{
    width: 200px;
}
.email{
    width: 300px;
}
.user-remove{
    background: none;
    width: 28px;
    height: 28px;
    background-image: url('../assets/user-remove.svg');
    background-repeat: no-repeat;
    background-size: contain;
    padding: 4px;
    border-radius: 4px;
}
.user-remove:hover{
    background: none;
    background-image: url('../assets/user-remove-hover.svg');
    background-repeat: no-repeat;
    background-size: contain;
}
.add-user{
    
    background-color: #87BBA2;
    font-weight: 600;
    font-size: 18px;
    color: #FFFFFF;
    padding: 20px 40px;
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
}
.add-user:hover{
    background-color: #5d737e;
}
.user-add-icon{
    width: 32px;
    height: 32px;
    background-image: url('../assets/user-add.svg');
    background-repeat: no-repeat;
    background-size: contain;
}

</style>
