<script lang="ts" setup>
import { ref } from 'vue';
import type { Item, Person } from './types'

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
    
    const items = ref([
        { id: '0', title: 'Item A', discription:'An extraordinarily long English word!', added_people:['',], label_color: '#FF0000', list: 1, in_edit: false},
        { id: '1', title: 'Item B', discription:'', added_people:['',], label_color: '#FF0000', list: 1, in_edit: false},
        { id: '2', title: 'Item C', discription:'', added_people:['',], label_color: '#FF0000', list: 2, in_edit: false},
        { id: '3', title: 'Item D', discription:'', added_people:['',], label_color: '#FF0000', list: 3, in_edit: false},
    ]);

    items.value = getStorageData('items', items.value);
    setStorageData('items', items.value);
    

    const getList = (list:number) => {
        return items.value.filter((item) => item.list == list);
    }

    const startDrag = (event:DragEvent, item:Item) => {
        if(event.dataTransfer){
            event.dataTransfer.dropEffect = 'move';
        }
        
        if(event.dataTransfer){
            event.dataTransfer.effectAllowed = 'move';
        }
        if(event.dataTransfer){
            event.dataTransfer.setData('itemID', item.id);
        }
    }

    const onDrop = (event:DragEvent, list:number) => {
        
        const itemID = event.dataTransfer ? event.dataTransfer.getData('itemID') : null;
        if(itemID){
            const item = items.value.find((item) => item.id == itemID);
            if(item){
                item.list = list;
            }
        }
        setStorageData('items', items.value);
        
    }

    function addElement(list_id:number){
        items.value.push({id: (items.value.length).toString(), title: 'new', discription:'', added_people:['',], label_color: '#FF0000', list: list_id, in_edit: false});
        setStorageData('items', items.value);
    }

    function deleteElement(id:string){
        let pos = items.value.findIndex(item => item.id == id);
        items.value.splice(pos, 1);
        for(let i=0; i<items.value.length; i++){
            items.value[i].id = i.toString();
        }
        setStorageData('items', items.value);
    }

    function editElement(id:string){
        items.value.forEach( item => item.in_edit = (item.id == id) ? !item.in_edit : false);
        setStorageData('items', items.value);
    }

    const lists = ref([
        {title: "не начато", list_id: 1, in_edit: false},
        {title: "в процессе", list_id: 2, in_edit: false},
        {title: "готово", list_id: 3, in_edit: false},
    ]);
    lists.value = getStorageData('lists', lists.value);
    setStorageData('lists', lists.value);

    function addList(){
        lists.value.push({title: "New List", list_id: lists.value.length+1, in_edit: false});
        setStorageData('items', items.value);
        setStorageData('lists', lists.value);
    }
    function deleteList(list_id:number){
        if(lists.value.length == 1){
            items.value.splice(0, items.value.length);
            lists.value.splice(list_id-1, 1);
        }
        else{
            lists.value.splice(list_id-1, 1);
            for(let i=0; i<lists.value.length; i++){
                lists.value[i].list_id = i+1;
            }
            for(let i=0; i<items.value.length; i++){
                if(items.value[i].list >= list_id){
                    items.value[i].list -= 1; 
                    if(items.value[i].list == 0){
                        items.value[i].list = 1;
                    }
                }
            }
        }
        setStorageData('lists', lists.value);
        setStorageData('items', items.value);
    }

    function editList(list_id:number){
        lists.value[list_id-1].in_edit = !lists.value[list_id-1].in_edit;
        setStorageData('lists', lists.value);
    }
    
    const people = ref<Person[]> ([]);
    people.value = getStorageData('people', people.value);
    setStorageData('people', people.value);

    const selected = ref<String[]>([]);
        
    function addPerson(id:string){
        let pos = items.value.findIndex(item => item.id == id);
        items.value[pos].added_people.splice(0, items.value[pos].added_people.length);
        for(let i=0; i<selected.value.length; i++){
            items.value[pos].added_people.push(selected.value[i].toString());
        }
        setStorageData('items', items.value);
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
    <div class="drag-drop-window">
        <button @click="addList" class="add-column">
            <div class="add-icon"></div>
            Добавить колонку
        </button>
        <div class="columns">
            <div v-for="list in lists">    
                <div v-if="!list.in_edit" class="label-buttons">
                    <div @click="list.in_edit = !list.in_edit">{{ list.title }}</div>
                    <button @click="deleteList(list.list_id)" class="delete-button"></button>
                </div>
                <div v-if="list.in_edit">
                    <input type="text" v-model="list.title" />
                    <button @click="editList(list.list_id)">OK</button>
                </div>
                <div class="drop-zone" @drop="onDrop($event, list.list_id)" @dragenter.prevent @dragover.prevent>
                    <div v-for="item in getList(list.list_id)" 
                    :key="item.id" 
                    class="drag-el" 
                    draggable="true" 
                    @dragstart="startDrag($event, item)" :style="{outlineColor: (!item.in_edit) ? '#232523' : '#87BBA2', outlineWidth: (!item.in_edit) ? '0px' : '4px'}">
                        <div class="task" >
                            <div class="label-buttons">
                                <div class="label" :style="{backgroundColor:item.label_color}"></div>
                                <div class="buttons">
                                    <button v-if="!item.in_edit" @click="editElement(item.id)" class="edit-button"></button>
                                    <button @click="deleteElement(item.id)" class="delete-button"></button>
                                </div>
                            </div>
                            
                            <div class="title">{{ item.title }}</div>
                            <div class="discription">{{ item.discription }}</div>
                            <div class="added-people">
                                <div v-for="people in item.added_people">
                                {{ people }}
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
                <button @click="addElement(list.list_id)">Добавить новый таск</button>
            </div>
            
        </div>
    </div>
        <div class="edit-window">
            <div v-for="item in items">
                <div v-if="item.in_edit" class="edit-label">
                    Цвет
                    <input type="color" v-model="item.label_color">
                    Название
                    <input type="text" v-model="item.title" />
                    Описание
                    <textarea v-model="item.discription" rows="3"></textarea>
                    Люди
                    <a-config-provider :theme="theme">
                        <a-select
                            v-model:value="selected"
                            mode="multiple"
                            style="width: 100%"
                            placeholder="Please select"
                            :options="[...people].map((_, i) => ({ value: people[i].name }))"
                            @change="addPerson(item.id)"
                        ></a-select>
                    </a-config-provider>
                    <div class="buttons">
                        <button @click="editElement(item.id)">ok</button>
                    </div>
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
    }
    button:hover{
        background-color: #5d737e;
    }
    .add-column{
        margin-top: 40px;
        background-color: #87BBA2;
        font-weight: 600;
        font-size: 20px;
        color: #FFFFFF;
        padding: 40px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        
    }
    .add-column:hover{
        background-color: #5d737e;
    }
    .add-icon{
        width: 40px;
        height: 40px;
        background-image: url('../assets/add.svg');
        background-repeat: no-repeat;
        background-size: contain;
    }
    .drag-drop-window{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 100px 80px;
        gap: 80px;
    }
    .columns {
        /*width: 100%;*/
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        gap: 15px;
        justify-content: center;
        align-items: flex-start;
        
    }

    .drop-zone{
        
        min-width: 100px;
        background-color: #5d737e;
        padding: 10px;
        min-height: 10px;
        height: fit-content;
    }

    .drag-el{
        width: 230px;
        background-color: #f0f7ee;
        outline: 2px solid #232523;
        outline-offset: -1px;
        border-radius: 2px;
        margin-bottom: 10px;
        padding: 5px;
    }
    .drag-el:nth-last-of-type(1){
        margin-bottom: 0;
    }
    .task{
        display: flex;
        flex-direction: column;
    }
    .buttons{
        display: flex;
        flex-direction: row;
        gap: 5px;
    }
    .label{
        width: 40px; 
        height: 10px;
        border-radius: 5px;
    }
    textarea{
        resize: vertical;
    }
    .task .title{
        font-weight: 700;
    }
    .edit-window{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content:flex-start;
        padding-top: 10px;
        padding-bottom: 10px;
        min-width: 0px;
        width: fit-content;
        height: 100%;
        position: fixed;
        top: 0px;
        right: 0px;
        min-height: 0px;
        box-sizing: border-box;
        
        background-color: #87BBA2;
    }
    .edit-label{
        display: flex;
        flex-direction: column;
        background-color: #f0f7ee;
        
        padding: 10px;
        margin: 40px 20px;
        border-radius: 2px;
        gap: 4px;
    }
    .edit-button{
        background: none;
        width: 28px;
        height: 28px;
        background-image: url('../assets/edit.svg');
        background-repeat: no-repeat;
        background-size: contain;
        padding: 4px;
        border-radius: 4px;
    }
    .edit-button:hover{
        background: none;
        background-image: url('../assets/edit-hover.svg');
        background-repeat: no-repeat;
        background-size: contain;
    }
    .delete-button{
        background: none;
        width: 28px;
        height: 28px;
        background-image: url('../assets/delete.svg');
        background-repeat: no-repeat;
        background-size: contain;
        padding: 4px;
        border-radius: 4px;
    }
    .delete-button:hover{
        background: none;
        background-image: url('../assets/delete-hover.svg');
        background-repeat: no-repeat;
        background-size: contain;
    }
    .label-buttons{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    
</style>
