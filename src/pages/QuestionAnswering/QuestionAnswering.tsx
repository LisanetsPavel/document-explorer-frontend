import { useContext, useEffect, useRef, useState } from 'react';
import { Card, Textarea, Typography } from '@material-tailwind/react';
import { generateClient, GraphQLResult } from 'aws-amplify/api';
import { postQuestion } from '../../graphql/question/mutations.ts';
import { AppContext, AppDispatchContext } from '../../store/AppContext.ts';
import { PostQuestionOutput } from '../../types/Question.ts';
import { AppState } from '../../store/AppReducer.ts';
import { useParams } from 'react-router-dom';
import { PUT_MESSAGE, SET_HISTORY, UPDATE_LAST_MESSAGE } from '../../store/actions.ts';

const client = generateClient();

export default function QuestionAnswering() {
    const [message, setMessage] = useState<string>('');
    const [answerTyping, setAnswerTyping] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);
    const dispatch = useContext(AppDispatchContext);
    const { historyId: historyIdParam } = useParams();

    const [newHistoryId, setNewHistoryId] = useState<string | undefined>(undefined);

    const { history } = useContext<AppState>(AppContext);

    const historyId = historyIdParam || newHistoryId;

    const messages = (history && historyId && history[historyId]) || [];

    useEffect(() => {
        if (historyIdParam && newHistoryId) {
            setNewHistoryId(undefined);
        }
    }, [historyIdParam, newHistoryId]);

    const handleSendMessage = async () => {
        let currentHistoryId = newHistoryId;
        if (!currentHistoryId) {
            currentHistoryId = crypto.randomUUID();
            setNewHistoryId(currentHistoryId);
            dispatch({ type: SET_HISTORY, payload: { historyId: currentHistoryId, messages: [{ text: message, isMyMessage: true }] } });
        } else {
            dispatch({ type: PUT_MESSAGE, payload: { historyId: currentHistoryId, message: { text: message, isMyMessage: true } } });
        }

        setMessage('');

        setAnswerTyping(true);

        dispatch({ type: PUT_MESSAGE, payload: { historyId: currentHistoryId, message: { text: '', isMyMessage: false } } });

        const result = (await client.graphql({
            query: postQuestion,
            variables: {
                questionInput: {
                    question: message,
                },
            },
        })) as GraphQLResult<PostQuestionOutput>;

        let answer = result.data.postQuestion.answer;

        if (!answer || answer === '') {
            answer = "Kendra can't answer your question";
        }

        let index = 0;

        const interval = setInterval(() => {
            if (index == answer.length) {
                clearInterval(interval);
                setAnswerTyping(false);
                const input = inputRef.current?.firstChild as HTMLInputElement;
                if (input) {
                    setTimeout(() => {
                        input.focus();
                    }, 0);
                }
            }

            const newAnswer = answer.slice(0, index);

            dispatch({ type: UPDATE_LAST_MESSAGE, payload: { historyId: currentHistoryId, message: { text: newAnswer, isMyMessage: false } } });

            index++;
        }, 60);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-4 h-[calc(100%-64px)] flex flex-col">
            <h2 className=" text-left h-[5%]">Ask your question</h2>
            <div className="shadow-md p-2 bg-gray-100 h-[95%] flex flex-col gap-6">
                <Card className=" w-full h-[83%] overflow-auto rounded p-4">
                    {messages.map((message, index) => (
                        <div className={`flex flex-col w-fit m-2 ${message.isMyMessage ? 'self-end ml-24' : 'self-start mr-24'}`}>
                            <Typography className="mb-0 self-start font-bold">{message.isMyMessage ? 'You:' : 'Kendra:'}</Typography>
                            <Typography
                                key={index}
                                className={`rounded-xl bg-indigo-50 w-fit break-all  p-3  ${message.isMyMessage ? 'text-right' : 'text-left'}`}
                            >
                                {message.text}
                                {!message.isMyMessage && index === messages.length - 1 && answerTyping && (
                                    <span className="ml-1 inline-block w-1 h-3 bg-gray-700" style={{ animation: 'blink 1s step-end infinite' }} />
                                )}
                            </Typography>
                        </div>
                    ))}
                </Card>
                <Textarea
                    ref={inputRef}
                    autoFocus
                    disabled={answerTyping}
                    onKeyDown={handleKeyDown}
                    value={message}
                    label="Write your answer"
                    className="flex-1"
                    color="indigo"
                    onChange={(event) => setMessage(event.target.value)}
                />
            </div>
        </div>
    );
}
