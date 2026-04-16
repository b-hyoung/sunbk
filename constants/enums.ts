/** 상수 정의 */

// 애플리케이션의 페이지 경로를 정의
export enum Routes {
    ROOT = "/",
    MENU = "menu",
    ABOUT = "about",
    WORK = "work",
    CONTACT = "contact",
    AUTH = "auth",

    PROFILE = "profile",
    ADMIN = "admin",

    // 선박
    VESSELS = "vessels",
    BOOKING = "booking",
    SHIPYARD = "shipyard",
}

// 네비게이션 링크 정의
export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export function getNavLinks(): NavLink[] {
  return [
    { href: `/${Routes.VESSELS}`,   label: "선박 임대·판매" },
    { href: `/${Routes.WORK}`,      label: "작업현장" },
    { href: `/${Routes.ABOUT}`,     label: "회사소개" },
    { href: `/${Routes.CONTACT}`,   label: "오시는길" },
    {
      href: "#",
      label: "협력사",
      children: [
        { href: `/${Routes.SHIPYARD}`, label: "제일산업공사 (조선소)" },
        { href: "#", label: "사단법인 (미정)" },
      ],
    },
  ];
}

/*  애플리케이션의 페이지 이름을 정의 
    Routes.ADMIN + / + Pages.USERS → /admin/users
*/
export enum Pages {
    LOGIN = "signin",
    REGISTER = "signup",
    FORGOT_PASSWORD = "forgot-password",
    USERS = "users",
    NEW = "new",
    EDIT = "edit",
}

// 입력 필드의 유형을 정의
export enum InputTypes {
    TEXT = "text",
    EMAIL = "email",
    PASSWORD = "password",
    NUMBER = "number",
    DATE = "date",
    TIME = "time",
    DATE_TIME_LOCAL = "datetime-local",
    CHECKBOX = "checkbox",
    RADIO = "radio",
    SELECT = "select",
    TEXTAREA = "textarea",
    FILE = "file",
    IMAGE = "image",
    COLOR = "color",
    RANGE = "range",
    TEL = "tel",
    URL = "url",
    SEARCH = "search",
    MONTH = "month",
    WEEK = "week",
    HIDDEN = "hidden",
    MULTI_SELECT = "multi select",
}

// 인증 관련 메시지 정의
export enum AuthMessages {
    LOGIN_SUCCESS = "Login successfully",
    LOGOUT_SUCCESS = "Logout successfully",
    REGISTER_SUCCESS = "Register successfully",
    FORGET_PASSWORD_SUCCESS = "Forget password successfully",
    RESET_PASSWORD_SUCCESS = "Reset password successfully",
}

// 애플리케이션의 환경을 정의
export enum Environments {
    PROD = "production",
    DEV = "development",
}

// 사용자 역할을 정의
export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

// API 메서드를 정의
export enum Methods{
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

/* API 응답에 따른 상태를 정의 
    - 알림에 따른 디자인 틀 조건부 처리 편해짐
*/
export enum Responses {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
  }
