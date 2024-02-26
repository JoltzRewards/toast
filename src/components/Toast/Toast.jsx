import React, { createContext, useContext, useReducer, useCallback, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
	CheckCircleIcon,
	ShieldExclamationIcon,
	ExclamationCircleIcon,
	InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

const ToastContext = createContext();

const ToastReducer = (state, action) => {
	switch (action.type) {
		case "ADD_TOAST":
			return [...state, action.payload];

		case "REMOVE_TOAST":
			return state.filter((toast) => toast.ID !== action.payload);

		default:
			return state;
	}
};

export const ToastProvider = ({ children, className }) => {
	const [state, dispatch] = useReducer(ToastReducer, []);

	const addToast = useCallback((type, content, duration) => {
		const ID = Math.random();

		// Define the removeToast function
		const removeToast = () => dispatch({ type: "REMOVE_TOAST", payload: ID });

		// Allow content to be a function so it can receive the removeToast function
		const resolvedContent = typeof content === "function" ? content(removeToast) : content;

		dispatch({
			type: "ADD_TOAST",
			payload: { ID, type, content: resolvedContent, duration },
		});

		if (typeof duration === "number") {
			setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: ID }), duration);
		}
	}, []);

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			{ReactDOM.createPortal(<ToastContainer toasts={state} className={className} />, document.body)}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const { addToast } = useContext(ToastContext);

	return {
		success: (content, duration = 3000) => addToast("success", content, duration + 300),
		error: (content, duration = 3000) => addToast("error", content, duration + 300),
		warn: (content, duration = 3000) => addToast("warning", content, duration + 300),
		info: (content, duration = 3000) => addToast("info", content, duration + 300),
	};
};

const ToastContainer = ({ toasts, className }) => (
	<div className="preflight fixed top-0 z-40 w-full space-y-2 p-4 sm:right-0">
		{toasts.map(({ ID, type, content, duration }) => (
			<Toast key={ID} type={type} content={content} duration={duration} className={className} />
		))}
	</div>
);

const Toast = ({ type, content, duration, className }) => {
	const ref = useRef(null);

	useEffect(() => {
		if (!ref) {
			return;
		}

		// Delay for fade-in.
		const start = setTimeout(() => {
			ref.current.style.opacity = "1";
		}, 300); 

		// Delay for fade-out.
		const end = setTimeout(() => {
			ref.current.style.opacity = "0";
		}, duration - 300); 

		return () => {
			clearTimeout(start);
			clearTimeout(end);
		}
	}, [ref, duration]);

	return (
		<div
			ref={ref}
			className={twMerge(
				`mx-auto flex w-fit items-center rounded-xl bg-black px-6 py-4 font-semibold shadow-lg transition-opacity duration-300 ease-in text-white sm:mr-0`,
				className
			)}
			style={{
				opacity: "0"
			}}
		>
			{toastTypeToIcon(type)}
			<span className="ml-3">{content}</span>
		</div>
	);
};

const toastTypeToIcon = (type) => {
	switch (type) {
		case "success":
			return <CheckCircleIcon className="h-5 w-5 flex-shrink-0 stroke-white stroke-2" />;

		case "error":
			return <ShieldExclamationIcon className="h-5 w-5 flex-shrink-0 stroke-red-500 stroke-2" />;

		case "warning":
			return <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 stroke-yellow-500 stroke-2" />;

		case "info":
			return <InformationCircleIcon className="h-5 w-5 flex-shrink-0 stroke-cyan-500 stroke-2" />;

		default:
			return <InformationCircleIcon className="h-5 w-5 flex-shrink-0 stroke-gray-500 stroke-2" />;
	}
};
