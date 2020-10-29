import { from, fromEvent } from 'rxjs'
import { map, tap, filter, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
    currentTarget: T
    target: Element    
}

const stepperEl = document.querySelector('#stepper') as HTMLElement
const allSteps = stepperEl.querySelectorAll<HTMLElement>('.step')
const allForms = stepperEl.querySelectorAll<HTMLFormElement>('form')

const allSteps$ = from(allSteps)

const mountApp$ = fromEvent(document, 'DOMContentLoaded')

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
    .pipe(
        tap(e => e.preventDefault()),
    )

const activeStep$ = submitForm$
    .pipe(
        tap(() => { debugger })
        map(e => {
            const currentStep = Number(e.currentTarget.getAttribute('data-step'))
            return currentStep < allSteps.length ? currentStep + 1 : currentStep
        }),
        switchMap(nextStep => allSteps$.pipe(
            filter(element => +element.getAttribute('data-step') !== nextStep),
        ))
    )

allSteps$.subscribe(element => element.hidden = true)
mountApp$.subscribe(() => allSteps[0].hidden = false)
activeStep$.subscribe(element => element.hidden = false)
submitForm$.subscribe(console.log);