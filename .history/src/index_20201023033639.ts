import { from, fromEvent, of } from 'rxjs'
import { tap, filter,  } from 'rxjs/operators'

const stepperEl = document.querySelector('#stepper') as HTMLElement
const stepsEl = stepperEl.querySelectorAll<HTMLElement>('.step')
const formsEl = stepperEl.querySelectorAll<HTMLElement>('form')
const nextButtonsEl = stepperEl.querySelectorAll<HTMLElement>('button')

const currentStep$ = of(1)

const showingStep$ = from(stepsEl)
    .pipe(
        tap(element => element.hidden = false),
        filter(element => +element.getAttribute('data-step') !== 1),
        tap(element => element.hidden = true),
    )

const submitForm$ = fromEvent(formsEl, 'submit')
    .pipe(
        tap(e => e.preventDefault()),
    )

showingStep$.subscribe(console.log);
submitForm$.subscribe(console.log);
