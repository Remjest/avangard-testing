import { JSX } from "react";

export type NestedCategories = 'services' | 'expertise';

export interface Category {
    categoryId:    number;
    categoryName:  string;
    subcategories?: Subcategory[];
}

export interface FirstLevelMenuItem {
    route: string;
    name: string;
    icon: JSX.Element;
    id: number;
    isNested: boolean;
}

export interface Subcategory {
    subcategoryId:   number;
    subcategoryName: string;
    services?:        Service[];
}

export interface Service {
    serviceId:       number;
    title:           string;
    mainText:        string;
    picLinkPreview:  string;
    extraText?:       string;
    price:           string;
    important?:      string;
    picLinkMain:     string;
    metaTitle?:       string;
    metaDescription?: string;
    metaKeywords?:    string;
    subtitle?:       string;
    alias:           string;
    subText?:        string;
    videoLink?:      string;
}

export interface Main {
    about:             About;
    propertyValuation: PropertyValuation;
    workPrinciples:    WorkPrinciple[];
    advantages:        Advantage[];
    metaTitle:         string;
    metaDescription:   string;
    metaKeywords:      string;
}

export interface About {
    info:      string[];
    important: string;
    videoURL:  string;
}

export interface Advantage {
    header:      string;
    description: string;
}

export interface PropertyValuation {
    info:     string;
    imageURL: string;
    price:    string;
}

export interface WorkPrinciple {
    text:    string;
    iconURL: string;
}

