<template>
    <div className="ui-seven-segment-display-wrapper">
        This is a Seven Segment Display widget.
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'UISevenSegmentDisplay',
    inject: ['$socket', '$dataTracker'],
    props: {
        /* do not remove entries from this - Dashboard's Layout Manager's will pass this data to your component */
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({ enabled: false, visible: false }) }
    },
    computed: {
        ...mapState('data', ['messages']),
        value: function () {
            switch (this.props.valueType) {
            case 'msg': {
                const msg = this.messages[this.id]
                if (msg && Object.prototype.hasOwnProperty.call(msg, this.props.value)) {
                    return msg[this.props.value]
                }
                break
            }
            case 'str':
                return parseInt(this.props.value, 16).toString(2)
            case 'num':
                return this.props.value.toString(2)
            }
            return 1
        }
    },
    created () {
        // setup our event handlers, and informs Node-RED that this widget has loaded
        this.$dataTracker(this.id, this.onInput, this.onLoad, this.onDynamicProperties)
    },
    methods: {
        /*
            widget-action just sends a msg to Node-RED, it does not store the msg state server-side
            alternatively, you can use widget-change, which will also store the msg in the Node's datastore
        */
        send (msg) {
            this.$socket.emit('widget-action', this.id, msg)
        },
        /*
            (optional) Custom onInput function to handle incoming messages from Node-RED
        */
        onInput (msg) {
            // load the latest message from the Node-RED datastore when this widget is loaded
            // storing it in our vuex store so that we have it saved as we navigate around
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
        },
        /*
            (optional) Custom onLoad function to handle the loading state of the widget
            msg   - the latest message from the Node-RED datastore
            state - The Node-RED config, including any overrides saved to the server-side statestore
        */
        onLoad (msg, state) {
            // loads the last msg received into this node from the Node-RED datastore
            // state is auto-stored into the widget props, but is available here if you want to do anything else
        },
        /*
            (optional) Custom onDynamicProperties function to handle dynamic properties
            msg - the latest message from the Node-RED datastore
        */
        onDynamicProperties (msg) {
            // handle any dynamic properties that are sent from Node-RED
            const updates = msg.ui_update
            if (!updates) {
                return
            }
            if (typeof updates.example !== 'undefined') {
                // use the globally available "setDynamicProperties" function to store any updates to this property
                this.setDynamicProperties({ example: updates.example })
            }
        }
    }
}
</script>

<style scoped>
.ui-seven-segment-display-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 2px;
}
</style>
