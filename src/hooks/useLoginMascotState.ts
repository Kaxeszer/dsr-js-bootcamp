import { useState } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'
import type {
    UseFormRegisterReturn,
} from 'react-hook-form'

export function useLoginMascotState() {
    const [nicknameLength, setNicknameLength] = useState(0)
    const [passwordLength, setPasswordLength] = useState(0)
    const [isNicknameFocused, setIsNicknameFocused] = useState(false)
    const [isPasswordFocused, setIsPasswordFocused] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    function bindNicknameField(field: UseFormRegisterReturn) {
        const { onChange, onBlur, ...rest } = field
        return {
            ...rest,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                setNicknameLength(e.target.value.length)
                void onChange(e)
            },
            onFocus: () => setIsNicknameFocused(true),
            onBlur: (e: FocusEvent<HTMLInputElement>) => {
                setIsNicknameFocused(false)
                void onBlur(e)
            },
        }
    }

    function bindPasswordField(field: UseFormRegisterReturn) {
        const { onChange, onBlur, ...rest } = field
        return {
            ...rest,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                setPasswordLength(e.target.value.length)
                void onChange(e)
            },
            onFocus: () => setIsPasswordFocused(true),
            onBlur: (e: FocusEvent<HTMLInputElement>) => {
                setIsPasswordFocused(false)
                void onBlur(e)
            },
        }
    }

    function toggleVisibility() {
        setIsPasswordVisible((v) => !v)
    }

    return {
        nicknameLength,
        passwordLength,
        isNicknameFocused,
        isPasswordFocused,
        isPasswordVisible,
        bindNicknameField,
        bindPasswordField,
        toggleVisibility,
    }
}