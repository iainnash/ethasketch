<template>
  <div class="publish" >
    <button @click="fanon">draw on</button>
    <button @click="fanoff">draw off</button>
    <table>
    <tr>
    <td></td>
    <td>
      <button @click="moveup">move up</button>
    </td>
    <td></td>
    </tr>
    <tr>
    <td>
      <button @click="moveleft">move left</button>
    </td>
    <td></td>
    <td>
      <button @click="moveright">move right</button>
    </td>
    </tr>
    <tr>
    <td></td>
    <td>
      <button @click="movedown">move down</button>
    </td>
    </tr>
    </table>
    <input @keydown.up="moveup" @keydown.down="movedown" @keydown.left="moveleft" @keydown.right="moveright" @keydown.o="fanoff" @keydown.n="fanon" />
  </div>
</template>

<script>
export default {
  methods: {
    fanon () {
      this.$mqtt.publish('/fan/on', 'fan on')
    },
    fanoff () {
      this.$mqtt.publish('/fan/off', 'fan off')
    },
    moveup () {
      this.$mqtt.publish('/move', JSON.stringify({x: 200, y: -50}))
    },
    moveright () {
      this.$mqtt.publish('/move', JSON.stringify({x: 50, y: 200}))
    },
    moveleft () {
      this.$mqtt.publish('/move', JSON.stringify({x: -50, y: -200}))
    },
    movedown () {
      this.$mqtt.publish('/move', JSON.stringify({x: -200, y: 50}))
    }
  },
  mqtt: {
    'VueMqtt/publish1' (data, topic) {
      console.log(topic + ': ' + String.fromCharCode.apply(null, data))
    },
    'VueMqtt/publish2' (data, topic) {
      console.log(topic + ': ' + String.fromCharCode.apply(null, data))
    }
  }
}
</script>
