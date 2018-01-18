const isFunction = (A) =>
    typeof A === 'function'

const isObject = (A) =>
    (typeof A === "object") && (A !== null)


function patch(fn, { after, before, condition, replace, afterAsResult }) {
    // Original function can be completely
    // replaced with the new one
    const oldfn = replace || fn

    return function (...args) {
        // Make sure that context is ok
        const context = this
        let result
        let beforeresult

        // If condition exists and passed
        if (isFunction(condition) 
            && (condition.apply(context, args) === false)
        ) {
            return false
        }

        // Fire before
        if (isFunction(before)) {
            beforeresult = before.apply(context, args)
        }

        // Before callback can return a promise
        if (beforeresult !== undefined && beforeresult.then) {
            const _args = [...args]
            beforeresult.then((resolved) => {
                args.push(resolved)
                result = oldfn.apply(context, _args)
                if (isFunction(after)) {
                    after.apply(context, _args)
                }
            })
        } else {
            result = oldfn.apply(context, args)
            if (isFunction(after)) {
                const afterresult = after.apply(context, [...args, result])
                if (afterAsResult) {
                    return afterresult
                }
            }

        }

        return result
    }
}


export default patch