<template>
    <div className="ui-seven-segment-display-wrapper">
        <div
            class="segment horizontal segment-a"
            :class="{ active: segments.a }"
        />

        <div class="middle-row">
            <div
                class="segment vertical segment-f"
                :class="{ active: segments.f }"
            />
            <div
                class="segment vertical segment-b"
                :class="{ active: segments.b }"
            />
        </div>

        <div
            class="segment horizontal segment-g"
            :class="{ active: segments.g }"
        />

        <div class="middle-row">
            <div
                class="segment vertical segment-e"
                :class="{ active: segments.e }"
            />
            <div
                class="segment vertical segment-c"
                :class="{ active: segments.c }"
            />
        </div>

        <div
            class="segment horizontal segment-d"
            :class="{ active: segments.d }"
        />

        <div
            class="segment dot segment-dot"
            :class="{ active: segments.dp }"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'

const KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'].reverse()
const normalizeNum = (num) => Math.max(0, Math.min(255, Math.floor(num)))
const convertSegments = (str) => Object.fromEntries(
    parseInt(str, 16).toString(2).padStart(8, '0')
        .split('').map((bit, id) => [KEYS[id], bit === '1'])
)

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
        segments: function () {
            let hexStr = '0'
            switch (this.props.valueType) {
            case 'msg': {
                const msg = this.messages[this.id]
                if (msg && Object.prototype.hasOwnProperty.call(msg, this.props.value)) {
                    if (typeof msg[this.props.value] === 'number') {
                        hexStr = normalizeNum(msg[this.props.value]).toString(16)
                    } else {
                        hexStr = msg[this.props.value] || '0'
                    }
                }
                break
            }
            case 'num':
                hexStr = normalizeNum(this.props.value || 0).toString(16)
                break
            case 'str':
                hexStr = this.props.value || '0'
                break
            }
            return convertSegments(hexStr)
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
    position: relative;
    width: 120px;
    height: 200px;
    margin: 20px auto;
    background-color: #000;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.segment {
    background-color: #666;
}

.segment.active {
    background-color: #f00;
}

.horizontal {
    height: 12px;
    position: relative;
    margin: 0 12px;
    border-radius: 2px;
}

.horizontal::before {
    content: '';
    position: absolute;
    top: 0;
    left: -6px;
    right: -6px;
    height: 100%;
    background: inherit;
    clip-path: polygon(6px 0%, calc(100% - 6px) 0%, 100% 50%, calc(100% - 6px) 100%, 6px 100%, 0% 50%);
}

.vertical {
    width: 12px;
    height: 70px;
    position: relative;
    border-radius: 2px;
}

.vertical::before {
    content: '';
    position: absolute;
    top: -6px;
    bottom: -6px;
    left: 0;
    width: 100%;
    background: inherit;
    clip-path: polygon(0% 6px, 50% 0%, 100% 6px, 100% calc(100% - 6px), 50% 100%, 0% calc(100% - 6px));
}

.segment-a {
    align-self: stretch;
}

.segment-g {
    align-self: stretch;
}

.segment-d {
    align-self: stretch;
}

.middle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.segment-f, .segment-e {
    align-self: flex-start;
}

.segment-b, .segment-c {
    align-self: flex-end;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
    right: 4px;
    background-color: #666;
}

.dot.active {
    background-color: #f00;
}
</style>
