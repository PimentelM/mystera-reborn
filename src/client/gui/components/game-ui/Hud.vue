<template>
    <div v-if="mob">
<!--        <p><strong>Player:</strong> {{mob.name}}</p>-->
<!--        <p><strong>Level:</strong> {{mob.level}}</p>-->
<!--        <p><strong>Position:</strong> {{mob.x}} {{mob.y}}</p>-->
        <p><strong>Map:</strong> {{dlevel}}</p>
    </div>
</template>

<script>
    export default {
        name: "Hud.vue",
        computed : {
            mob(){
                return true || window.Player.mob;
            },
            dlevel(){
                return window.dlevel;
            }

        }
    }
</script>

<style scoped>

</style>