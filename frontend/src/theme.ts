import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
    theme: {
        tokens: {
            colors: {
                primary: {
                    value: "#0A4D68",
                },
                primaryDark: {
                    value: "#083d52",
                },
                accent: {
                    value: "#05C7E2",
                },
                accentSoft: {
                    value: "#E8F9FD",
                },
                bgLight: {
                    value: "#FAFBFC",
                },
                bgWhite: {
                    value: "#FFFFFF",
                },
                textDark: {
                    value: "#1a2332",
                },
                textGray: {
                    value: "#6b7280",
                },
                border: {
                    value: "#e5e7eb",
                },
                success: {
                    value: "#10b981",
                },
                warning: {
                    value: "#f59e0b",
                },
                danger: {
                    value: "#ef4444",
                },
            },
            fonts: {
                heading: {
                    value: "'Crimson Pro', serif",
                },
                body: {
                    value: "'DM Sans', sans-serif",
                },
            },
            shadows: {
                sm: {
                    value: "0 1px 3px rgba(10, 77, 104, 0.08)",
                },
                md: {
                    value: "0 4px 12px rgba(10, 77, 104, 0.12)",
                },
                lg: {
                    value: "0 10px 30px rgba(10, 77, 104, 0.15)",
                },
            },
        },
    },
})

export const system = createSystem(defaultConfig, customConfig)
