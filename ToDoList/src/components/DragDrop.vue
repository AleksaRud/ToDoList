<script lang="ts">
import { ref } from 'vue';

export default {
    setup() {
        
        const items = ref([
            { id: '0', title: 'Item A', list: 1, in_edit: false},
            { id: '1', title: 'Item B', list: 1, in_edit: false},
            { id: '2', title: 'Item C', list: 2, in_edit: false},
            { id: '3', title: 'Item D', list: 3, in_edit: false},
        ])
        
        localStorage.setItem('items', JSON.stringify(items));
        const getList = (list:number) => {
            return items.value.filter((item) => item.list == list);
            
        }

        const startDrag = (event:DragEvent, item:{id:string, title:String, list:number, in_edit:boolean}) => {
            console.log(item);

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
            localStorage.setItem('items', JSON.stringify(items));
        }

        function addElement(list_id:number){
            items.value.push({id: (items.value.length).toString(), title: 'new', list: list_id, in_edit: false});
            localStorage.setItem('items', JSON.stringify(items));
        }

        function deleteElement(id:string){
            let pos = items.value.findIndex(item => item.id == id);
            items.value.splice(pos, 1);
            for(let i=0; i<items.value.length; i++){
                items.value[i].id = i.toString();
            }
            localStorage.setItem('items', JSON.stringify(items));
        }

        return {
            getList,
            onDrop,
            startDrag,
            addElement,
            deleteElement,
        }
    },
}

</script>

<template>
    <div class="columns">
        <div>
            Не начато
            <div class="drop-zone" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
                <div v-for="item in getList(1)" 
                :key="item.id" 
                class="drag-el" 
                draggable="true" 
                @dragstart="startDrag($event, item)">
                    <div v-if="!item.in_edit">
                        {{ item.title }}
                        <button @click="addElement(1)">+</button>
                        <button @click="deleteElement(item.id)">-</button>
                        <button @click="item.in_edit = !item.in_edit">edit</button>
                    </div>
                    <div v-if="item.in_edit">
                        <input type="text" v-model="item.title" />
                        <button @click="item.in_edit = !item.in_edit">ok</button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            В процессе
            <div class="drop-zone" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent>
                <div v-for="item in getList(2)" 
                :key="item.id" 
                class="drag-el" 
                draggable="true" 
                @dragstart="startDrag($event, item)">
                    <div v-if="!item.in_edit">
                        {{ item.title }}
                        <button @click="addElement(2)">+</button>
                        <button @click="deleteElement(item.id)">-</button>
                        <button @click="item.in_edit = !item.in_edit">edit</button>
                    </div>
                    <div v-if="item.in_edit">
                        <input type="text" v-model="item.title" />
                        <button @click="item.in_edit = !item.in_edit">edit</button>
                    </div>
                </div>
            </div>
        </div>
        <div>
            Готово
            <div class="drop-zone" @drop="onDrop($event, 3)" @dragenter.prevent @dragover.prevent>
                <div v-for="item in getList(3)" 
                :key="item.id" 
                class="drag-el" 
                draggable="true" 
                @dragstart="startDrag($event, item)">
                    <div v-if="!item.in_edit">
                        {{ item.title }}
                        <button @click="addElement(3)">+</button>
                        <button @click="deleteElement(item.id)">-</button>
                        <button @click="item.in_edit = !item.in_edit">edit</button>
                    </div>
                    <div v-if="item.in_edit">
                        <input type="text" v-model="item.title" />
                        <button @click="item.in_edit = !item.in_edit">ok</button>
                    </div>
                </div>
            </div>
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
</style>
