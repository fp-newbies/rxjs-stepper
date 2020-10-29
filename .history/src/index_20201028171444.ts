import { from, fromEvent } from 'rxjs'
import { map, tap, filter, find, switchMap, publishBehavior } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLElement>('#stepper .step')
const allForms = document.querySelectorAll<HTMLFormElement>('#stepper form')

const allSteps$ = from(allSteps)

const mountApp$ = fromEvent(document, 'DOMContentLoaded')

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const activeIndexStep$ = submitForm$
  .pipe(
    map(e => {
      const currentStep = Number(e.currentTarget.getAttribute('data-step'))
      const activeIndexStep = currentStep < allSteps.length ? currentStep + 1 : currentStep
      return activeIndexStep
    }),
    publishBehavior(1),
  )

const hiddenSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      filter(element => +element.getAttribute('data-step') !== activeIndexStep),
    )
  ),
)

const visibleSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      find(element => +element.getAttribute('data-step') === activeIndexStep),
    )
  ),
)

// activeIndexStep$.subscribe((v) => console.log('activeIndexStep', v))
hiddenSteps$.subscribe((stepElement) => {
  console.log('hiddenSteps', stepElement)
  stepElement.hidden = true
})
visibleSteps$.subscribe((stepElement) => {
  console.log('visibleSteps', stepElement)
  stepElement.hidden = false
})
// submitForm$.subscribe((v) => console.log('submitForm', v));
