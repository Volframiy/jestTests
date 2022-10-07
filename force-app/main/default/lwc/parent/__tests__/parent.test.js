import { createElement } from 'lwc';
import Parent from 'c/parent';
import getUserData from '@salesforce/apex/JestData.getUserData';
const mockGetUserData = require('./data/mockGetUserData.json');

jest.mock(
    '@salesforce/apex/JestData.getUserData',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);


describe('c-parent', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks()
    });

    async function flushPromises() {
        return Promise.resolve();
    }

    it('Test Creat Parent', async () => {
        const element = createElement('c-parent', { is: Parent });
        element.userId = '02042003'

        document.body.appendChild(element);

        let countOfParent = document.body.childNodes.length;
        let input = element.shadowRoot.querySelector('lightning-input');

        expect(1).toBe(countOfParent);
        expect('02042003').toBe(element.userId);
        expect('').toBe(input.value);
        expect('Enter word').toBe(input.label);
    });

    it('Test Add Correct Word', async () => {
        const element = createElement('c-parent', { is: Parent });
        document.body.appendChild(element);

        let child = element.shadowRoot.querySelector('c-child');
        let input = element.shadowRoot.querySelector('lightning-input');
        let button = element.shadowRoot.querySelector('[data-id="addbutton"]');

        input.value = 'Dog';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        await flushPromises();

        let errorMessages = element.shadowRoot.querySelectorAll('p');

        expect(button.label).toBe('Add to list');
        expect(child.rows.length).toBe(1);
        expect(child.rows[0].value).toBe('Dog');
        expect(errorMessages.length).toBe(0);
        //expect(input.value).toBe(element.getInput());   //problem with this
    });

    it('Test Add Incorrect Word', async () => {
        const element = createElement('c-parent', { is: Parent });
        document.body.appendChild(element);

        let child = element.shadowRoot.querySelector('c-child');
        let input = element.shadowRoot.querySelector('lightning-input');
        let button = element.shadowRoot.querySelector('[data-id="addbutton"]');

        input.value = '';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        await flushPromises();

        let errorMessages = element.shadowRoot.querySelectorAll('p');

        expect(child.rows.length).toBe(0);
        expect(errorMessages.length).toBe(1);
    });

    it('Test Clear Words', async () => {
        const element = createElement('c-parent', { is: Parent });
        document.body.appendChild(element);

        let child = element.shadowRoot.querySelector('c-child');
        let input = element.shadowRoot.querySelector('lightning-input');
        let button = element.shadowRoot.querySelector('[data-id="addbutton"]');

        input.value = 'Dog';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        input.value = 'Cat';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        input.value = 'Tiger';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        expect(child.rows.length).toBe(3);

        let buttonClear = element.shadowRoot.querySelector('[data-id="clearbutton"]');
        buttonClear.dispatchEvent(new CustomEvent("click", {}));

        await flushPromises();

        expect(child.rows.length).toBe(0);
    });

    it('Test Click Word', async () => {
        const element = createElement('c-parent', { is: Parent });
        document.body.appendChild(element);

        let child = element.shadowRoot.querySelector('c-child');
        let input = element.shadowRoot.querySelector('lightning-input');
        let button = element.shadowRoot.querySelector('[data-id="addbutton"]');

        input.value = 'Cat';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        input.value = 'Tiger';
        input.dispatchEvent(new CustomEvent("change", {}));
        button.dispatchEvent(new CustomEvent("click", {}));

        await flushPromises();

        let item = child.shadowRoot.querySelector('[data-id="0"]');
        item.dispatchEvent(new CustomEvent("click", {}));

        expect(child.rows.length).toBe(2);
        expect(item.value).toBe(0);
        expect(item.textContent).toBe('Cat');

        await flushPromises();

        expect(input.value).toBe(element.getInput());
    });

    it('Test Wire', async () => {
        const element = createElement('c-parent', { is: Parent });
        document.body.appendChild(element);

        let child = element.shadowRoot.querySelector('c-child');

        getUserData.emit(mockGetUserData);

        await flushPromises();

        expect(element.userId).toBe(mockGetUserData.userId);
        expect(child.message).toBe(mockGetUserData.message);
    });
});