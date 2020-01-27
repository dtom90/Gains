function pickerToolbar (weight = true) {
  return function () {
    return '<div class="toolbar">' +
           '<div class="toolbar-inner">' +
           '<div class="left">' +
           (weight
             ? '<a class="link open-rep-picker"><i class="f7-icons">chevron_down</i></a>'
             : '<a class="link open-weight-picker"><i class="f7-icons">chevron_up</i></a>') +
           '</div>' +
           '<div class="right">' +
           '<a href="#" class="link sheet-close popover-close">Done</a>' +
           '</div>' +
           '</div>' +
           '</div>'
  }
}

const picker = {
  weightPicker (f7, inputEl, initialWeight, open = () => {}, close = () => {}, scrollToEl = undefined) {
    const maxWeight = Math.max(500, initialWeight * 2)
    const step1 = '+/- 1'
    const step5 = '+/- 5'
    const weightOptions = {
      [step5]: [...Array(maxWeight / 5 + 1).keys()].map(x => x * 5),
      [step1]: [...Array(maxWeight + 1).keys()]
    }

    return f7.picker.create({
      inputEl,
      scrollToEl,
      renderToolbar: pickerToolbar(true),
      formatValue: function (values) {
        return values[1]
      },
      cols: [
        {
          textAlign: 'left',
          values: Object.keys(weightOptions),
          onChange (picker, step) {
            if (picker.cols[1].replaceValues) {
              let currentValue = parseInt(picker.value[1])
              if (step === step5 && currentValue % 5 !== 0) {
                currentValue = Math.round(currentValue / 5) * 5
              }
              picker.cols[1].replaceValues(weightOptions[step])
              picker.cols[1].setValue(currentValue, 0)
            }
          }
        },
        {
          values: Object.values(weightOptions)[0],
          width: 160
        }
      ],
      value: [initialWeight % 5 === 0 ? step5 : step1, initialWeight],
      on: { open, close }
    })
  },

  repPicker (f7, inputEl, initialReps, open = () => {}, close = () => {}, scrollToEl = undefined) {
    const maxReps = Math.max(500, initialReps * 2)

    return f7.picker.create({
      inputEl,
      scrollToEl,
      renderToolbar: pickerToolbar(false),
      cols: [
        {
          textAlign: 'center',
          values: [...Array(maxReps).keys()].map(x => x + 1)
        }
      ],
      value: [initialReps],
      on: { open, close }
    })
  }
}

export default picker
