<script lang="ts">
import { ref } from 'vue';

  export default {
    setup() {
      const items = ref([
        { id: '0', title: 'Item A', list: 1},
        { id: '1', title: 'Item B', list: 1},
        { id: '2', title: 'Item C', list: 2},
        { id: '3', title: 'Item D', list: 3},
      ])
      const getList = (list:number) => {
       return items.value.filter((item) => item.list == list)
      }

      const startDrag = (event:DragEvent, item:{id:string, title:String, list:number}) => {
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
        
      }

      return {
        getList,
        onDrop,
        startDrag,
      }
    },
  }

</script>

<template>
    <div class="columns">
        <div class="drop-zone" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent>
            <div v-for="item in getList(1)" 
            :key="item.id" 
            class="drag-el" 
            draggable="true" 
            @dragstart="startDrag($event, item)">
            {{ item.title }}
            </div>
        </div>
        <div class="drop-zone" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent>
            <div v-for="item in getList(2)" 
            :key="item.id" 
            class="drag-el" 
            draggable="true" 
            @dragstart="startDrag($event, item)">
            {{ item.title }}
            </div>
        </div>
        <div class="drop-zone" @drop="onDrop($event, 3)" @dragenter.prevent @dragover.prevent>
            <div v-for="item in getList(3)" 
            :key="item.id" 
            class="drag-el" 
            draggable="true" 
            @dragstart="startDrag($event, item)">
            {{ item.title }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.columns {
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  gap: 15px;
}

.drop-zone{
  width: 200px;
  background-color: gray;
  padding: 10px;
  min-height: 10px;
  height: fit-content;
}

.drag-el{
  background-color: #FFFFFF;
  border: 2px solid black;
  margin-bottom: 10px;
  padding: 5px;
}
.drag-el:nth-last-of-type(1){
  margin-bottom: 0;
}
</style>
