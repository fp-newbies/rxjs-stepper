import { from, fromEvent, of } from 'rxjs'
import { tap, filter, share, switchMap } from 'rxjs/operators'

interface DOMEvent<T = Element> extends Event {
    currentTarget: T;
    target: Element;
}

const stepperEl = document.querySelector('#stepper') as HTMLElement
const stepsEl = stepperEl.querySelectorAll<HTMLElement>('.step')
const formsEl = stepperEl.querySelectorAll<HTMLElement>('form')
const nextButtonsEl = stepperEl.querySelectorAll<HTMLElement>('button')

const currentStep$ = of(1)
    .pipe(
        share(),
    )


const showingStep$ = from(stepsEl)
    .pipe(
        tap(element => element.hidden = false),
        filter(element => +element.getAttribute('data-step') !== 1),
        tap(element => element.hidden = true),
    )

const submitForm$ = fromEvent<DOMEvent>(formsEl, 'submit')
    .pipe(
        tap(e => e.preventDefault()),
        tap(e => {
            const stepIndex = e.currentTarget.getAttribute
            console.log(e.currentTarget)
        })
    )

// showingStep$.subscribe(console.log);
submitForm$.subscribe(console.log);
