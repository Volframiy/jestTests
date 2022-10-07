import { createElement } from 'lwc';
import Child from 'c/child';

describe('c-child', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    async function flushPromises() {
        return Promise.resolve();
    }

    it('Test Create Child', async () => {
        const element = createElement('c-child', {is: Child});
        element.rows = [{value: 'one', id: 0}, {value: 'two', id: 0}];
        element.message = 'Test List of Words';

        document.body.appendChild(element);

        await flushPromises();

        let countOfListItems = element.shadowRoot.querySelectorAll('li');

        expect(element.rows.length).toBe(2);
        expect(countOfListItems.length).toBe(2);
        expect(element.message).toBe('Test List of Words');
    });
});