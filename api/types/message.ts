export default interface Message {
    id: number;
    type: string;
    use: 'PUT' | 'GET'; // these are the only two methods AR expects
    data?: any;
}