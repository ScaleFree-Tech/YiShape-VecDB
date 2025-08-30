



function getCopyrightInfo() {
    let info = {
        version: '易形空间 向量数据库管理系统 V0.9',
        statement: 'YiShape Vector Database. All Rights Reserved.',
        copy: '@Copyright 2023-2025'
    };
    return info;
}

function parseActiveIndex(url) {
    let supported = ['text_db_introduce', 'list_db', 'alter_db', 'list_domainword_task2', 'list_glove_task', 'alter_chat_glm','alter_qwen','alter_kimi', 'alter_ollama','alter_admin_config',
        'alter_deepseek', 'llm_test', 'alter_config', 'list_chunk_task', 'list_file_task', 'list_react_agent', 'list_agent_tool','alter_api_key',
        'list_image_db', 'list_customized_db', 'api_doc', 'user_homepage'];
    let p = url.lastIndexOf("/");
    let path = url.substring(p + 1);
    // console.log(path);
    if (supported.includes(path)) { return path; }
    else if (url.includes('doc_detail')) {
        return 'doc_detail';
    }
	else if (url.includes('alter_image_db')||url.includes('image_db_detail')||url.includes('image_db_search')) {
        return 'list_image_db';
    }
	else if (url.includes('alter_db')||url.includes('db_detail')||url.includes('db_search')) {
        return 'list_db';
    }
	else { return 'text_db_introduce'; }
}

function getRAGLLMTypes() {
    let types = [
        { value: 'YiShape', label: 'YiShape远程大模型（免费，本软件官方）' },
        { value: 'DeepSeek', label: 'DeepSeek远程API调用（满血版）' },
		{ value: 'ChatGLM4', label: 'ChatGLM4远程API调用' },
        { value: 'Ollama', label: 'Ollama本地大模型（需本地安装OLLAMA）' }
    ];
    return types;
}

function getTaskLLMTypes() {
    let types = [
        { value: 'Ollama', label: 'Ollama本地大模型（需本地安装OLLAMA）' }
    ];
    return types;
}




function getChatHistoryDB() {
    let db = new Dexie('chat_history');
    db.version(2).stores({
        chatHistory: '++id, title, type, llmType, db, genTime, history, messages'
    });
    return db;
}



function timestampToString(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份是从0开始的
    var day = ('0' + date.getDate()).slice(-2);
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    var seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function scrollToBottom(obj, divId) {
    obj.$nextTick(() => {
        try {
            const div = document.getElementById(divId);
            if (div) {
                // 强制滚动到底部
                div.scrollTop = div.scrollHeight + 1000;

                // 对于某些浏览器，可能需要延迟滚动
                setTimeout(() => {
                    div.scrollTop = div.scrollHeight + 1000;
                }, 50);
            }
        } catch (e) {
            console.error('滚动到底部失败', e);
        }
    });
}