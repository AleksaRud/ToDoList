<script lang="ts">
import { ref } from 'vue';

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


export default {
    setup() {

        type Item = {
            id:string, 
            title:String, 
            discription:String, 
            label_color:String, 
            list:number, 
            in_edit:boolean
        };

        const items = ref([
            { id: '0', title: 'Item A', discription:'An extraordinarily long English word!', label_color: '#FF0000', list: 1, in_edit: false},
            { id: '1', title: 'Item B', discription:'', label_color: '#FF0000', list: 1, in_edit: false},
            { id: '2', title: 'Item C', discription:'', label_color: '#FF0000', list: 2, in_edit: false},
            { id: '3', title: 'Item D', discription:'', label_color: '#FF0000', list: 3, in_edit: false},
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
            items.value.push({id: (items.value.length).toString(), title: 'new', discription:'', label_color: '#FF0000', list: list_id, in_edit: false});
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
            let pos = items.value.findIndex(item => item.id == id);
            items.value[pos].in_edit = !items.value[pos].in_edit;
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
                    if(items.value[i].list == list_id){
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
        return {
            getList,
            onDrop,
            startDrag,
            addElement,
            deleteElement,
            editElement,
            lists,
            addList,
            deleteList,
            editList,
        }
    },
}




</script>

<template>
    
    <button @click="addList" style="margin-top: 40px; margin-left: 200px;">Добавить колонку</button>
    <div class="columns">
        <div v-for="list in lists">    
            <div v-if="!list.in_edit">
                {{ list.title }}
                <button @click="deleteList(list.list_id)">Удалить</button>
                <button @click="list.in_edit = !list.in_edit">Edit</button>
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
                @dragstart="startDrag($event, item)">
                    <div v-if="!item.in_edit" class="task">
                        <div class="label" :style="{backgroundColor:item.label_color}"></div>
                        <div class="title">{{ item.title }}</div>
                        <div class="discription">{{ item.discription }}</div>
                        <div class="buttons">
                            <button @click="addElement(list.list_id)">+</button>
                            <button @click="deleteElement(item.id)">-</button>
                            <button @click="item.in_edit = !item.in_edit">edit</button>
                        </div>
                    </div>
                    <div v-if="item.in_edit" class="task">
                        Цвет
                        <input type="color" v-model="item.label_color">
                        Название
                        <input type="text" v-model="item.title" />
                        Описание
                        <textarea v-model="item.discription" rows="3"></textarea>
                        <div class="buttons">
                            <button @click="editElement(item.id)">ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <button @click="addElement(list.list_id)">Добавить новый таск</button>
        </div>


    </div>
</template>

<style scoped>
    .columns {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 15px;
        justify-content: center;
        align-items: flex-start;
        margin-top: 100px;
    }

    .drop-zone{
        
        min-width: 100px;
        background-color: gray;
        padding: 10px;
        min-height: 10px;
        height: fit-content;
    }

    .drag-el{
        width: 200px;
        background-color: #FFFFFF;
        border: 2px solid black;
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
        font-weight: 600;
    }
    /*.task .discription{
        /*width: 40px;*/
        
        /*word-break:break-all;
    }*/
</style>
