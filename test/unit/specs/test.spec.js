import { createVue, destroyVM, triggerEvent } from '../util';
describe('Test', function() {
    let vm
    afterEach(() => {
        //destroyVM(vm)
    })
    it('should run in the browser not Mocha', function () {
        vm = createVue({
            template: `
            <div class="list">
                <div
                v-for="color in colors"
                class="list-item"
                v-dragging="{ list: colors, item: color, group: 'color' }"
                :key="color.text">
                {{ color.text }}
                </div>
            </div>
            `,
            data: function() {
                return {
                    colors: [
                        { text: "red" },
                        { text: "block" }
                    ]
                }
            }
        }, true)
        const obj1 = vm.$el.children[0]
        const obj2 = vm.$el.children[1]
        triggerEvent(obj1, 'dragstart')
        triggerEvent(obj2, 'dragenter')
    })
})
