import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import '../styles/FeedbackForm.css';

function FeedbackForm() {
  const [state, handleSubmit] = useForm('mykvrqbe');
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    if (state.succeeded) {
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="feedback-container">
      {/* フローティングボタン */}
      <button 
        className="feedback-button"
        onClick={() => setIsOpen(!isOpen)}
        title="意見・要望・バグ報告"
      >
        📝 フィードバック
      </button>

      {/* モーダル */}
      {isOpen && (
        <div className="feedback-modal">
          <div className="feedback-modal-content">
            <div className="feedback-modal-header">
              <h3>意見・要望・バグ報告</h3>
              <button 
                className="feedback-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {state.succeeded ? (
              <div className="feedback-success">
                ✓ ご送信ありがとうございました！
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="feedback-form">
                <div className="form-group">
                  <label htmlFor="name">お名前（任意）</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="お名前を入力"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">メールアドレス（任意）</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="メールアドレスを入力"
                  />
                  <ValidationError field="email" errors={state.errors} />
                </div>

                <div className="form-group">
                  <label htmlFor="message">メッセージ<span className="required">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="ご意見・ご要望・バグ報告をお聞かせください"
                    rows="5"
                    required
                  ></textarea>
                  <ValidationError field="message" errors={state.errors} />
                </div>

                <button 
                  type="submit" 
                  className="feedback-submit-btn"
                  disabled={state.submitting}
                >
                  {state.submitting ? '送信中...' : '送信'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackForm;
