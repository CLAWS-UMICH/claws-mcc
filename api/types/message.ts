export default interface Message {
    id: number;
    type: string;
    use: 'PUT' | 'GET';
    data?: any;
}

